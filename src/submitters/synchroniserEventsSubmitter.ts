/* eslint-disable no-magic-numbers */
import { IPostEventsBulk } from '@splitsoftware/splitio-commons/src/services/types';
import { StoredEventWithMetadata } from '@splitsoftware/splitio-commons/src/sync/submitters/types';
import { IEventsCacheAsync } from '@splitsoftware/splitio-commons/types/storages/types';

/**
 * Constant to define the amount of Events to pop from Storage.
 */
const EVENTS_AMOUNT = 1000;
/**
 * Maximum number of bytes to be fetched from cache before posting to the backend.
 */
const MAX_QUEUE_BYTE_SIZE = 5 * 1024 * 1024; // 5MB
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
 * @returns {() => Promise<boolean|string>}
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
        let eventsQueue = [];
        let eventsQueueSize: number = 0;

        try {
          while (processedEvents[_eMetadataKeys[i]].length > 0) {
            const currentEvent = processedEvents[_eMetadataKeys[i]].splice(0, 1)[0];
            const currentEventSize = JSON.stringify(currentEvent).length;

            // Case when the Queue size is already full.
            if ((eventsQueueSize + currentEventSize) * 1024 > MAX_QUEUE_BYTE_SIZE) {
              await postEventsBulk(JSON.stringify(eventsQueue));
              eventsQueueSize = 0;
              eventsQueue = [];
            }
            eventsQueue.push(currentEvent);

            // Case when there are no more events to process and the queue has events to be sent.
            if (!processedEvents[_eMetadataKeys[i]][0] && eventsQueue.length > 0) {
              await postEventsBulk(JSON.stringify(eventsQueue));
            }
            eventsQueueSize += currentEventSize;
          }
        } catch (error) {
          return Promise.resolve(false);
        }
      }
      return Promise.resolve(true);
    })
    .catch((e) => `An error occurred when getting data from storage: ${e}`);
}
