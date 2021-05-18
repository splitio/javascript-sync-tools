import { IPostTestImpressionsBulk } from '@splitsoftware/splitio-commons/src/services/types';
import { IImpressionsCacheAsync } from '@splitsoftware/splitio-commons/types/storages/types';

/**
 * NOT IMPLEMENTED YET.
 *
 * @param {IPostTestImpressionsBulk} postClient        HTTPClient API to perform the POST request.
 * @param {IImpressionsCacheAsync}   impressionsCache  Impressions Cache Storage reference.
 * @throws Error.
 */
export function impressionsSubmitterFactory<TState extends { length?: number }>(
  postClient: IPostTestImpressionsBulk,
  impressionsCache: IImpressionsCacheAsync,
) {
  throw new Error('Not Implemented');
}
