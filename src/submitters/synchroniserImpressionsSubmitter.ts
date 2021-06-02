import { IPostTestImpressionsBulk } from '@splitsoftware/splitio-commons/src/services/types';
import { IImpressionsCacheAsync } from '@splitsoftware/splitio-commons/types/storages/types';
import { StoredImpressionWithMetadata }
  from '@splitsoftware/splitio-commons/types/sync/submitters/types';
import { ImpressionDTO } from '@splitsoftware/splitio-commons/types/types';
import { ImpressionsDTOWithMetadata } from '../types';
import { truncateTimeFrame } from '@splitsoftware/splitio-commons/src/utils/time';
import ImpressionObserver from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/ImpressionObserver';
import ImpressionCountsCacheInMemory
  from '@splitsoftware/splitio-commons/src/storages/inMemory/ImpressionCountsCacheInMemory';
import { groupByMetadata, metadataToHeaders } from './metadataUtils';
import { SplitIO } from '@splitsoftware/splitio-commons/src/types';

/**
 * Constant to define the amount of Events to pop from Storage.
 * >>>> TODO: Set this constant when executing the Synchroniser.
 */
const IMPRESSIONS_AMOUNT = 1000;
/**
 * Function to create an ImpressionDTOWithMetadata object from a StoredImpressionWithMetadata.
 * Basically it's transforming each StoredImpression key to its full name.
 *
 * @param {StoredImpressionWithMetadata} storedImpression  The target impression.
 * @returns {ImpressionsDTOWithMetadata}
 */
export const impressionWithMetadataToImpressionDTO = (storedImpression: StoredImpressionWithMetadata) => {
  const {
    m,
    i,
  } = storedImpression;

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
};

/**
 * Factory that returns an Impressions submitter, capable of fetching the Impressions from the storage,
 * process them and sent to the Split's Services.
 *
 * @param {IPostTestImpressionsBulk}      postClient        HTTPClient API to perform the POST request.
 * @param {IImpressionsCacheAsync}        impressionsCache  Impressions Cache Storage reference.
 * @param {ImpressionObserver}            observer          The Impression Observer object for the dedupe process.
 * @param {ImpressionCountsCacheInMemory} countsCache       The reference to the Impresion's Count Storage.
 * @returns {() => Promise<boolean>}
 */
export function impressionsSubmitterFactory(
  postClient: IPostTestImpressionsBulk,
  impressionsCache: IImpressionsCacheAsync,
  observer: ImpressionObserver,
  countsCache?: ImpressionCountsCacheInMemory,
): () => Promise<boolean> {
  return () => impressionsCache.popNWithMetadata(IMPRESSIONS_AMOUNT)
    .then((dataImpressions: StoredImpressionWithMetadata[]) => {
      const impressionsWithMetadataToPost: ImpressionsDTOWithMetadata[] = [];

      // convert Impressions Metadata into Impressions DTO
      const storedImpressions = dataImpressions.map(impression => impressionWithMetadataToImpressionDTO(impression));

      storedImpressions.forEach((impressionWithMetadata) => {
        const { impression } = impressionWithMetadata;

        if (observer) {
          // Adds previous time if it is enabled
          impression.pt = observer.testAndSet(impression);
        }

        const now = Date.now();
        if (countsCache) {
          // Increments impression counter per featureName
          countsCache.track(impression.feature, now, 1);
        }

        // Checks if the impression should be added in queue to be sent
        if (!countsCache || !impression.pt || impression.pt < truncateTimeFrame(now)) {
          impressionsWithMetadataToPost.push(impressionWithMetadata);
        }
      });

      const impressionsWithMetadataProcessedToPost: { [metadataAsKey: string]: ImpressionsDTOWithMetadata[]} =
        groupByMetadata(impressionsWithMetadataToPost, 'metadata');

      try {
        const impressionMode: SplitIO.ImpressionsMode = countsCache ? 'OPTIMIZED' : 'DEBUG';

        Object.keys(impressionsWithMetadataProcessedToPost).forEach(async (key) => {
          const impressions = impressionsWithMetadataProcessedToPost[key].map((data) => data.impression);
          const metadata = impressionsWithMetadataProcessedToPost[key][0].metadata;
          const headers = Object.assign({}, metadataToHeaders(metadata), { SplitSDKImpressionsMode: impressionMode });

          // @ts-expect-error
          await postClient(JSON.stringify(impressions), headers);
        });
      } catch (error) {
        return Promise.resolve(false);
      }
      return Promise.resolve(true);
    })
    // @todo: add Logger for error tracking.
    .catch((e) => {
      console.log(`An error occurred when getting data from storage: ${e}`);
      return false;
    });
}
