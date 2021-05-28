import { IPostTestImpressionsBulk } from '@splitsoftware/splitio-commons/src/services/types';
import { IImpressionsCacheAsync } from '@splitsoftware/splitio-commons/types/storages/types';
import { StoredImpressionWithMetadata } from
  '@splitsoftware/splitio-commons/types/sync/submitters/types';
import { ImpressionDTO } from '@splitsoftware/splitio-commons/types/types';
import { ImpDedupModule, ImpressionsDTOWithMetadata } from '../types';
import { truncateTimeFrame } from '@splitsoftware/splitio-commons/src/utils/time';

/**
 * Factory that returns an Impressions submitter, capable of fetching the Impressions from the storage,
 * process them and sent to the Split's Services.
 *
 * @param {IPostTestImpressionsBulk} postClient               HTTPClient API to perform the POST request.
 * @param {IImpressionsCacheAsync}   impressionsCache         Impressions Cache Storage reference.
 * @param {ImpDedupModule}           impressionsCountsModule  The reference to the impresions' Storage.
 * @returns {() => Promise<boolean|string>}
 */
export function impressionsSubmitterFactory(
  postClient: IPostTestImpressionsBulk,
  impressionsCache: IImpressionsCacheAsync,
  impressionsCountsModule?: ImpDedupModule,
) {
  return () => impressionsCache.popNWithMetadata(1000)
    .then(async (dataImpressions: StoredImpressionWithMetadata[]) => {
      // convert Impressions Metadata into Impressions DTO
      const storedImpressions = dataImpressions.map(impression => {
        const {
          m,
          i,
        } = impression;

        return {
          metadata: m,
          impression: {
            keyName: i.k,
            bucketingKey: i.b,
            feature: i.f,
            treatment: i.t,
            label: i.r,
            changeNumber: i.c,
            time: i.m,
          } as ImpressionDTO,
        };
      });

      const impressionsWithMetadataToPost: ImpressionsDTOWithMetadata[] = [];

      storedImpressions.forEach((impressionWithMetadata) => {
        const { impression } = impressionWithMetadata;

        if (impressionsCountsModule?.observer) {
          // Adds previous time if it is enabled
          impression.pt = impressionsCountsModule.observer.testAndSet(impression);
        }

        const now = Date.now();
        if (impressionsCountsModule?.countsCache) {
          // Increments impression counter per featureName
          impressionsCountsModule.countsCache.track(impression.feature, now, 1);
        }

        // Checks if the impression should be added in queue to be sent
        if (!impressionsCountsModule ||
          !impression.pt ||
          impression.pt < truncateTimeFrame(now)
        ) {
          impressionsWithMetadataToPost.push(impressionWithMetadata);
        }
      });

      try {
        await postClient(JSON.stringify(impressionsWithMetadataToPost));
      } catch (error) {
        return Promise.resolve(false);
      }
      return Promise.resolve(true);
    })
    // @todo: add Logger for error tracking.
    .catch((e) => `An error occurred when getting data from storage: ${e}`);
}
