/* eslint-disable no-magic-numbers */
import { ILogger } from '@splitsoftware/splitio-commons/src/logger/types';
import { IPostEventsBulk } from '@splitsoftware/splitio-commons/src/services/types';
import { StoredEventWithMetadata } from '@splitsoftware/splitio-commons/src/sync/submitters/types';
import { IEventsCacheAsync } from '@splitsoftware/splitio-commons/types/storages/types';
import { groupByMetadata, metadataToHeaders } from './metadataUtils';

/**
 * Constant to define the amount of Events to pop from Storage.
 */
const EVENTS_AMOUNT = 1000;
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
 * @param {IPostEventsBulk}   postEventsBulk  The Split's HTTPClient API to perform the POST request.
 * @param {IEventsCacheAsync} eventsCache     The Events storage Cache from where to retrieve the Events data.
 * @param {ILogger}           logger          The Synchronizer's Logger.
 * @returns {() => Promise<boolean|string>}
 */
export function eventsSubmitterFactory(
  postEventsBulk: IPostEventsBulk,
  eventsCache: IEventsCacheAsync,
  logger: ILogger,
  // @todo: Add retry param.
): () => Promise<boolean> {
  return () => eventsCache.popNWithMetadata(EVENTS_AMOUNT)
    .then(async (events) => {
      const processedEvents: ProcessedByMetadataEvents = groupByMetadata(events, 'm');
      const _eMetadataKeys = Object.keys(processedEvents);

      for (let j = 0; j < _eMetadataKeys.length; j++) {
        let eventsQueue = [];
        let eventsQueueSize: number = 0;
        const currentMetadataEventsQueue = processedEvents[_eMetadataKeys[j]];

        while (currentMetadataEventsQueue.length > 0) {
          const currentEvent = currentMetadataEventsQueue.shift() as StoredEventWithMetadata;
          const currentEventSize = JSON.stringify(currentEvent).length;

          // Case when the Queue size is already full.
          if ((eventsQueueSize + currentEventSize) > MAX_QUEUE_BYTE_SIZE) {
            await postEventsBulk(JSON.stringify(eventsQueue), metadataToHeaders(currentEvent.m));
            eventsQueue = [];
            eventsQueueSize = 0;
          }
          eventsQueue.push(currentEvent.e);
          eventsQueueSize += currentEventSize;

          // Case when there are no more events to process and the queue has events to be sent.
          if (currentMetadataEventsQueue.length === 0 && eventsQueue.length > 0) {
            await postEventsBulk(JSON.stringify(eventsQueue), metadataToHeaders(currentEvent.m));
          }
        }
      }
      return Promise.resolve(true);
    })
    .catch((e) => {
      logger.error(`An error occurred when processing Events: ${e}`);
      return false;
    });
}
