/* eslint-disable no-magic-numbers */
import { ILogger } from '@splitsoftware/splitio-commons/src/logger/types';
import { IPostEventsBulk } from '@splitsoftware/splitio-commons/src/services/types';
import { StoredEventWithMetadata } from '@splitsoftware/splitio-commons/src/sync/submitters/types';
import { IEventsCacheAsync } from '@splitsoftware/splitio-commons/types/storages/types';
import { SplitIO } from '@splitsoftware/splitio-commons/types/types';
import { groupBy, metadataToHeaders, retry } from './utils';

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
 * @param {IPostEventsBulk}   postEventsBulk  The Split's HTTPClient API to perform the POST request.
 * @param {IEventsCacheAsync} eventsCache     The Events storage Cache from where to retrieve the Events data.
 * @param {ILogger}           logger          The Synchronizer's Logger.
 * @param {number}            eventsPerPost   The amount of elements to pop from Storage.
 * @param {number}            maxRetries      The amount of retries attempt to perform the POST request.
 * @returns {() => Promise<boolean>}
 */
export function eventsSubmitterFactory(
  postEventsBulk: IPostEventsBulk,
  eventsCache: IEventsCacheAsync,
  logger: ILogger,
  eventsPerPost?: number,
  maxRetries?: number,
): () => Promise<boolean> {
  /**
   * Function to wrap the POST requests and retries attempt.
   *
   * @param {SplitIO.EventData[]}    eventsQueue      List of Events in EventData type.
   * @param {Record<string, string>} metadataHeaders  The Headers corresponding to Metadata.
   */
  async function tryPostEventsBulk(eventsQueue: SplitIO.EventData[], metadataHeaders: Record<string, string>) {
    await retry(
      () => postEventsBulk(JSON.stringify(eventsQueue), metadataHeaders),
      maxRetries || MAX_RETRIES
    );
  }
  /**
   * Function to wrap a batch process of events, in order to make it iterative.
   *
   * @param {number} batchSize  A configurable amount of events to POP from Storage.
   * @returns {Promise<boolean>}
   */
  function processEventsBatch(batchSize: number = EVENTS_AMOUNT_DEFAULT) {
    return eventsCache.popNWithMetadata(batchSize)
      .then(async (events) => {
        const processedEvents: ProcessedByMetadataEvents = groupBy(events, 'm');
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
              await tryPostEventsBulk(eventsQueue, metadataToHeaders(currentEvent.m));
              eventsQueue = [];
              eventsQueueSize = 0;
            }
            eventsQueue.push(currentEvent.e);
            eventsQueueSize += currentEventSize;

            // Case when there are no more events to process and the queue has events yet to be sent.
            if (currentMetadataEventsQueue.length === 0 && eventsQueue.length > 0) {
              await tryPostEventsBulk(eventsQueue, metadataToHeaders(currentEvent.m));
            }
          }
        }
        const count = await eventsCache.count();
        if (count > 0) await processEventsBatch(batchSize);
        return Promise.resolve(true);
      })
      .catch((e) => {
        logger.error(`An error occurred when processing Events: ${e}`);
        return false;
      });
  }

  return () => processEventsBatch(eventsPerPost);
}
