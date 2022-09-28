
import { IPostTestImpressionsCount } from '@splitsoftware/splitio-commons/src/services/types';
import { fromImpressionCountsCollector } from '@splitsoftware/splitio-commons/src/sync/submitters/impressionCountsSubmitter';
import { ImpressionCountsCacheInMemory } from '@splitsoftware/splitio-commons/src/storages/inMemory/ImpressionCountsCacheInMemory';
import { ILogger } from '@splitsoftware/splitio-commons/src/logger/types';
import { ImpressionCountsCachePluggable } from '@splitsoftware/splitio-commons/src/storages/pluggable/ImpressionCountsCachePluggable';
import { ImpressionCountsPayload } from '@splitsoftware/splitio-commons/src/sync/submitters/types';
import { MaybeThenable } from '@splitsoftware/splitio-commons/src/dtos/types';
import { submitterFactory } from './submitter';

export function impressionCountsSubmitterFactory(
  logger: ILogger,
  postClient: IPostTestImpressionsCount,
  impressionCountsCache: ImpressionCountsCacheInMemory | ImpressionCountsCachePluggable,
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

  return submitterFactory(logger, postClient, getPayload, 'impression counts', maxRetries);
}
