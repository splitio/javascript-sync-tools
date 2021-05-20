/* eslint-disable no-magic-numbers */
import { IPostEventsBulk } from '@splitsoftware/splitio-commons/src/services/types';
import { IEventsCacheAsync } from '@splitsoftware/splitio-commons/types/storages/types';

/**
 * Constant to define the amount of Events to pop from Storage.
 */
const EVENTS_AMOUNT = 1000;

// maximum allowed event size
const MAX_EVENT_SIZE = 1024 * 32;

// maximum number of bytes to be fetched from cache before posting to the backend
const MAX_QUEUE_BYTE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Function factory that will return an Event Submitter, that will be able to retrieve the
 * events from the Storage, process and group by Metadata and/or max bundle size, and finally push
 * to Split's BE services.
 *
 * @param {IPostEventsBulk}   postClient   The Split's HTTPClient API to perform the POST request.
 * @param {IEventsCacheAsync} eventsCache  The Events storage Cache from where to retrieve the Events data.
 * @throws
 */
export function eventsSubmitterFactory<TState extends { length?: number }>(
  postClient: IPostEventsBulk,
  eventsCache: IEventsCacheAsync,
) {
  throw new Error('Not Implemented');
}
