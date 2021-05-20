/* eslint-disable no-magic-numbers */
import { IPostEventsBulk } from '@splitsoftware/splitio-commons/src/services/types';
import { StoredEventWithMetadata } from '@splitsoftware/splitio-commons/src/sync/submitters/types';
import { IEventsCacheAsync } from '@splitsoftware/splitio-commons/types/storages/types';

/**
 * Constant to define the amount of Events to pop from Storage.
 */
const EVENTS_AMOUNT = 1000;

// maximum allowed event size
const MAX_EVENT_SIZE = 1024 * 32;

// maximum number of bytes to be fetched from cache before posting to the backend
const MAX_QUEUE_BYTE_SIZE = 5 * 1024 * 1024; // 5MB

type EventData = { metadata: any; event: any; };

/**
 * Function to Process every Event from the storage and group them by Metadata.
 * It returns true or false if process was succesful.
 *
 * @param {EventData} events  List of Events from the storage.
 * @returns {Promise<boolean>}
 */
const processEvents = (events: StoredEventWithMetadata[] = []) => {
  const _eventsMap: { [metadataAsKey: string]: StoredEventWithMetadata[]; } = {};

  events.forEach((eventData: StoredEventWithMetadata) => {
    const metadataKey = JSON.stringify(eventData.m);
    if (!_eventsMap[metadataKey]) _eventsMap[metadataKey] = [];
    _eventsMap[metadataKey].push(eventData);
  });

  return _eventsMap;
};

/**
 * Function factory that will return an Event Submitter, that will be able to retrieve the
 * events from the Storage, process and group by Metadata and/or max bundle size, and finally push
 * to Split's BE services.
 *
 * @param {IPostEventsBulk}   postEventsBulk  The Split's HTTPClient API to perform the POST request.
 * @param {IEventsCacheAsync} eventsCache     The Events storage Cache from where to retrieve the Events data.
 * @returns {Promise<boolean>}
 */
export function eventsSubmitterFactory(
  postEventsBulk: IPostEventsBulk,
  eventsCache: IEventsCacheAsync,
  // @todo: Add retry param.
) {
  return () => eventsCache.popNWithMetadata(EVENTS_AMOUNT)
    .then(async (events) => {
      const processedEvents = processEvents(events);
      const _eMetadataKeys = Object.keys(processedEvents);

      for (let i = 0; i < _eMetadataKeys.length; i++) {
        try {
          // @ts-ignore
          await postEventsBulk(JSON.stringify(processedEvents[_eMetadataKeys[i]]));
        } catch (error) {
          return Promise.resolve(false);
        }
      }
      return Promise.resolve(true);
    });
}
