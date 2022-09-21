
import { IPostTestImpressionsCount } from '@splitsoftware/splitio-commons/src/services/types';
import { fromImpressionCountsCollector }
  from '@splitsoftware/splitio-commons/src/sync/submitters/impressionCountsSubmitter';
import { ImpressionCountsCacheInMemory }
  from '@splitsoftware/splitio-commons/src/storages/inMemory/ImpressionCountsCacheInMemory';
import { ILogger } from '@splitsoftware/splitio-commons/src/logger/types';
import { ImpressionCountsCachePluggable }
  from '@splitsoftware/splitio-commons/src/storages/pluggable/ImpressionCountsCachePluggable';
import { ImpressionCountsPayload } from '@splitsoftware/splitio-commons/src/sync/submitters/types';
import { MaybeThenable } from '@splitsoftware/splitio-commons/src/dtos/types';

// @TODO reuse submitters from JS-commons after unifing ImpressionCountsCache interfaces
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
  impressionCountsCache: ImpressionCountsCacheInMemory | ImpressionCountsCachePluggable,
  logger: ILogger,
): () => Promise<boolean> {

  function getPayload(): MaybeThenable<ImpressionCountsPayload | undefined> {
    // @ts-ignore
    if (impressionCountsCache.getImpressionsCount) {
      return (impressionCountsCache as ImpressionCountsCachePluggable).getImpressionsCount();
    } else {
      const impressionCountsData = impressionCountsCache.pop();
      return Object.keys(impressionCountsData).length > 0 ?
        fromImpressionCountsCollector(impressionCountsData) :
        undefined;
    }
  }

  // eslint-disable-next-line no-async-promise-executor
  return async () => {
    const payload = await getPayload();

    try {
      if (payload) await postClient(JSON.stringify(payload));
    } catch (e) {
      logger.error(`An error occurred when processing Impressions Count : ${e}`);
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  };
}
