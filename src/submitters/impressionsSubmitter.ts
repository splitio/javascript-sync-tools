import type SplitIO from '@splitsoftware/splitio-commons/types/splitio';
import { IPostTestImpressionsBulk } from '@splitsoftware/splitio-commons/src/services/types';
import { IImpressionCountsCacheBase, IImpressionsCacheAsync } from '@splitsoftware/splitio-commons/src/storages/types';
import { StoredImpressionWithMetadata } from '@splitsoftware/splitio-commons/src/sync/submitters/types';
import { truncateTimeFrame } from '@splitsoftware/splitio-commons/src/utils/time';
import { ImpressionObserver } from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/ImpressionObserver';
import { groupBy, metadataToHeaders } from './utils';
import { ILogger } from '@splitsoftware/splitio-commons/src/logger/types';
import { IMetadata } from '@splitsoftware/splitio-commons/src/dtos/types';
import { ImpressionsPayload } from '@splitsoftware/splitio-commons/src/sync/submitters/types';
import { submitterWithMetadataFactory } from './submitter';

export type ImpressionsDTOWithMetadata = {
  metadata: IMetadata;
  impression: SplitIO.ImpressionDTO;
}

/**
 * Constant to define the amount of Events to pop from Storage.
 */
const IMPRESSIONS_AMOUNT_DEFAULT = 1000;
/**
 * Amount of attempts to retry a POST request action.
 */
const MAX_RETRIES = 3;
/**
 * Function to create an ImpressionDTOWithMetadata object from a StoredImpressionWithMetadata.
 * Basically it's transforming each StoredImpression key to its full name.
 *
 * @param storedImpression - The target impression.
 * @returns An ImpressionsDTOWithMetadata object.
 */
export const impressionWithMetadataToImpressionDTO = (storedImpression: StoredImpressionWithMetadata):
  ImpressionsDTOWithMetadata => {
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
      pt: i.pt,
      properties: i.properties,
    } as SplitIO.ImpressionDTO,
  };
};

/**
 * Factory that returns an Impressions submitter, capable of fetching the impressions from the storage,
 * process and send them to the Split cloud.
 *
 * @param logger - The Synchronizer's Logger.
 * @param postImpressionsBulk - HTTPClient API to perform the POST request.
 * @param impressionsCache - Impressions Cache Storage reference.
 * @param observer - The Impression Observer object for the dedupe process.
 * @param impressionsPerPost - Amount of elements to pop from storage.
 * @param maxRetries - Amount of attempt retries to perform the POST request.
 * @param countsCache - The reference to the Impression's Count Storage. Undefined in DEBUG mode.
 * @returns An impressions submitter function.
 */
export function impressionsSubmitterFactory(
  logger: ILogger,
  postImpressionsBulk: IPostTestImpressionsBulk,
  impressionsCache: IImpressionsCacheAsync,
  observer: ImpressionObserver,
  impressionsPerPost = IMPRESSIONS_AMOUNT_DEFAULT,
  maxRetries = MAX_RETRIES,
  countsCache?: IImpressionCountsCacheBase,
) {

  // @TODO reuse JS-commons strategies. Not possible now due to different input types: ImpressionDTO vs ImpressionDTOWithMetadata
  function fromCacheToPayload(dataImpressions: StoredImpressionWithMetadata[]) {
    const impressionsWithMetadataToPost: ImpressionsDTOWithMetadata[] = [];
    // convert Impressions Metadata into Impressions DTO
    const storedImpressions = dataImpressions.map(impression => impressionWithMetadataToImpressionDTO(impression));

    storedImpressions.forEach((impressionWithMetadata) => {
      const { impression } = impressionWithMetadata;

      // Re-assigns previous time in both OPTIMIZED and DEBUG modes
      impression.pt = observer.testAndSet(impression);

      const now = Date.now();

      if (countsCache) {
        // Increments impression counter per featureName
        if (impression.pt) countsCache.track(impression.feature, now, 1);
      }

      // Checks if the impression should be added in queue to be sent
      if (!countsCache || !impression.pt || impression.pt < truncateTimeFrame(now)) {
        impressionsWithMetadataToPost.push(impressionWithMetadata);
      }
    });

    const impressionsWithMetadataProcessedToPost: { [metadataAsKey: string]: ImpressionsDTOWithMetadata[] } =
      groupBy(impressionsWithMetadataToPost, 'metadata');

    const impressionMode: SplitIO.ImpressionsMode = countsCache ? 'OPTIMIZED' : 'DEBUG';

    const keys = Object.keys(impressionsWithMetadataProcessedToPost);
    const result = [];
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const impressions = impressionsWithMetadataProcessedToPost[key]
        .map((data) => data.impression);
      const metadata = impressionsWithMetadataProcessedToPost[key][0].metadata;
      const headers = Object.assign({}, metadataToHeaders(metadata), { SplitSDKImpressionsMode: impressionMode });
      // Group impressions by Feature key.
      const impressionsByFeature = groupBy(impressions, 'feature');

      let impressionsListToPost: ImpressionsPayload = [];
      Object.keys(impressionsByFeature).forEach((key) => {
        impressionsListToPost.push({
          f: JSON.parse(key),
          i: impressionsByFeature[key].map(entry => {
            return {
              k: entry.keyName, // Key
              t: entry.treatment, // Treatment
              m: entry.time, // Timestamp
              b: entry.bucketingKey, // Bucketing Key
              // `labelsEnabled` config parameter doesn't apply to synchronizer
              r: entry.label, // Rule label
              c: entry.changeNumber, // ChangeNumber
              pt: entry.pt, // Previous time
              properties: entry.properties,
            };
          }),
        });
      });
      // await tryPostImpressionsBulk(JSON.stringify(impressionsListToPost), headers);
      result.push({ payload: impressionsListToPost, headers });
    }

    return result;
  }
  return submitterWithMetadataFactory(logger, postImpressionsBulk, impressionsCache, 'impressions', impressionsPerPost, fromCacheToPayload, maxRetries);
}
