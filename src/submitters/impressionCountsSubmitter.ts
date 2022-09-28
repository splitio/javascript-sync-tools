
import { IPostTestImpressionsCount } from '@splitsoftware/splitio-commons/src/services/types';
import { fromImpressionCountsCollector } from '@splitsoftware/splitio-commons/src/sync/submitters/impressionCountsSubmitter';
import { ImpressionCountsCacheInMemory } from '@splitsoftware/splitio-commons/src/storages/inMemory/ImpressionCountsCacheInMemory';
import { ILogger } from '@splitsoftware/splitio-commons/src/logger/types';
import { ImpressionCountsCachePluggable } from '@splitsoftware/splitio-commons/src/storages/pluggable/ImpressionCountsCachePluggable';
import { ImpressionCountsPayload } from '@splitsoftware/splitio-commons/src/sync/submitters/types';
import { MaybeThenable } from '@splitsoftware/splitio-commons/src/dtos/types';
import { retry } from './utils';

export function impressionCountsSubmitterFactory(
  postClient: IPostTestImpressionsCount,
  impressionCountsCache: ImpressionCountsCacheInMemory | ImpressionCountsCachePluggable,
  logger: ILogger,
  maxRetries?: number,
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

  return async () => {
    try {
      const payload = await getPayload();
      if (payload) {
        // POST data with retry attempts
        try {
          await retry(
            () => postClient(JSON.stringify(payload)),
            maxRetries
          );
        } catch (err) {
          logger.error(`An error occurred when submitting impression counts to Split: ${err}`);
          return false;
        }
      }
    } catch (e) {
      logger.error(`An error occurred when retrieving impression counts from storage: ${e}`);
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  };
}
