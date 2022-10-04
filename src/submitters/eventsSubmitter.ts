import { ILogger } from '@splitsoftware/splitio-commons/src/logger/types';
import { IPostEventsBulk } from '@splitsoftware/splitio-commons/src/services/types';
import { StoredEventWithMetadata } from '@splitsoftware/splitio-commons/src/sync/submitters/types';
import { IEventsCacheAsync } from '@splitsoftware/splitio-commons/src/storages/types';
import { groupBy, metadataToHeaders } from './utils';
import { submitterWithMetadataFactory } from './submitter';

/**
 * Constant to define the amount of Events to pop from Storage.
 */
const EVENTS_AMOUNT_DEFAULT = 1000;
/**
 * Amount of attempts to retry a POST request action.
 */
const MAX_RETRIES = 3;
/**
 * Maximum number of bytes to be fetched from cache before posting to the backend.
 */
const MAX_QUEUE_BYTE_SIZE = 5 * 1024 * 1024; // 5MB
type ProcessedByMetadataEvents = {
  [metadataAsKey: string]: StoredEventWithMetadata[];
};
/**
 * Function factory that will return an Event Submitter, that will be able to retrieve the
 * events from the Storage, process and group by Metadata and/or max bundle size, and finally push
 * to Split's BE services. The result of this method is always a promise that will never be rejected.
 *
 * @param {ILogger}           logger          The Synchronizer's Logger.
 * @param {IPostEventsBulk}   postEventsBulk  The Split's HTTPClient API to perform the POST request.
 * @param {IEventsCacheAsync} eventsCache     The Events storage Cache from where to retrieve the Events data.
 * @param {number}            eventsPerPost   The amount of elements to pop from Storage.
 * @param {number}            maxRetries      The amount of retries attempt to perform the POST request.
 * @returns {() => Promise<boolean>}
 */
export function eventsSubmitterFactory(
  logger: ILogger,
  postEventsBulk: IPostEventsBulk,
  eventsCache: IEventsCacheAsync,
  eventsPerPost = EVENTS_AMOUNT_DEFAULT,
  maxRetries = MAX_RETRIES,
) {

  function fromCacheToPayload(events: StoredEventWithMetadata[]) {
    const processedEvents: ProcessedByMetadataEvents = groupBy(events, 'm');
    const _eMetadataKeys = Object.keys(processedEvents);
    const result = [];

    for (let j = 0; j < _eMetadataKeys.length; j++) {
      let eventsQueue = [];
      let eventsQueueSize: number = 0;
      const currentMetadataEventsQueue = processedEvents[_eMetadataKeys[j]];

      while (currentMetadataEventsQueue.length > 0) {
        const currentEvent = currentMetadataEventsQueue.shift() as StoredEventWithMetadata;
        const currentEventSize = JSON.stringify(currentEvent).length;

        // Case when the Queue size is already full.
        if ((eventsQueueSize + currentEventSize) > MAX_QUEUE_BYTE_SIZE) {
          // await tryPostEventsBulk(eventsQueue, metadataToHeaders(currentEvent.m));
          result.push({ payload: eventsQueue, headers: metadataToHeaders(currentEvent.m) });
          eventsQueue = [];
          eventsQueueSize = 0;
        }
        eventsQueue.push(currentEvent.e);
        eventsQueueSize += currentEventSize;

        // Case when there are no more events to process and the queue has events yet to be sent.
        if (currentMetadataEventsQueue.length === 0 && eventsQueue.length > 0) {
          // await tryPostEventsBulk(eventsQueue, metadataToHeaders(currentEvent.m));
          result.push({ payload: eventsQueue, headers: metadataToHeaders(currentEvent.m) });
        }
      }
    }

    return result;
  }

  return submitterWithMetadataFactory(logger, postEventsBulk, eventsCache, 'events', eventsPerPost, fromCacheToPayload, maxRetries);
}
