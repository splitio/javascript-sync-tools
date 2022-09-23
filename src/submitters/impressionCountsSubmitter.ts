
import { IPostTestImpressionsCount } from '@splitsoftware/splitio-commons/src/services/types';
import { fromImpressionCountsCollector } from '@splitsoftware/splitio-commons/src/sync/submitters/impressionCountsSubmitter';
import { ImpressionCountsCacheInMemory } from '@splitsoftware/splitio-commons/src/storages/inMemory/ImpressionCountsCacheInMemory';
import { ILogger } from '@splitsoftware/splitio-commons/src/logger/types';

/**
 * Factory that returns an impression counts submitter, capable of fetching the impressions counts from the storage,
 * process and send them to the Split cloud.
 *
 * @param {IPostTestImpressionsBulk}      postClient              HTTPClient API to perform the POST request.
 * @param {ImpressionCountsCacheInMemory} impressionCountsCache  Impressions Cache Storage reference.
 * @param {ILogger}                       logger                  The Synchronizer's Logger reference.
 * @returns {() => Promise<boolean>}
 */
export function impressionCountsSubmitterFactory(
  postClient: IPostTestImpressionsCount,
  impressionCountsCache: ImpressionCountsCacheInMemory,
  logger: ILogger,
): () => Promise<boolean> {
  // eslint-disable-next-line no-async-promise-executor
  return async () => {
    const impressionCountsData = impressionCountsCache.pop();
    if (Object.keys(impressionCountsData).length > 0) {
      const payload = fromImpressionCountsCollector(impressionCountsData);

      try {
        await postClient(JSON.stringify(payload));
      } catch (e) {
        logger.error(`An error occurred when processing Impressions Count : ${e}`);
        return Promise.resolve(false);
      }
    }

    return Promise.resolve(true);
  };
}
