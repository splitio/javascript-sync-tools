
import { IPostTestImpressionsCount } from '@splitsoftware/splitio-commons/src/services/types';
import { fromImpressionCountsCollector } from '@splitsoftware/splitio-commons/src/sync/submitters/impressionCountsSubmitter';
import { ImpressionCountsCacheInMemory } from '@splitsoftware/splitio-commons/src/storages/inMemory/ImpressionCountsCacheInMemory';
import { ILogger } from '@splitsoftware/splitio-commons/src/logger/types';
import { ImpressionCountsCachePluggable } from '@splitsoftware/splitio-commons/src/storages/pluggable/ImpressionCountsCachePluggable';
import { submitterFactory } from './submitter';

// @TODO at the moment we only pass a ImpressionCountsCachePluggable instance but eventually we might use ImpressionCountsCacheInMemory
export function impressionCountsSubmitterFactory(
  logger: ILogger,
  postClient: IPostTestImpressionsCount,
  impressionCountsCache: ImpressionCountsCachePluggable,
  maxRetries?: number,
  impressionCountsCacheInMemory?: ImpressionCountsCacheInMemory,
): () => Promise<boolean> {

  // @TODO we should update OPTIMIZED mode eventually to combine and send impression counts from the in-memory cache and the pluggable one
  async function getPayload() {
    let result = await impressionCountsCache.getImpressionsCount();

    // If there aren't impression counts in pluggable storage, we try to get them from the
    // in-memory cache available when Synchronizer runs in OPTIMIZED impressions mode
    if (!result && impressionCountsCacheInMemory) {
      const impressionCountsData = impressionCountsCacheInMemory.pop();
      result = Object.keys(impressionCountsData).length > 0 ?
        fromImpressionCountsCollector(impressionCountsData) :
        undefined;
    }

    return result;
  }

  return submitterFactory(logger, postClient, getPayload, 'impression counts', maxRetries);
}
