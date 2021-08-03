import { IPostTestImpressionsBulk } from '@splitsoftware/splitio-commons/src/services/types';
import { IImpressionsCacheAsync } from '@splitsoftware/splitio-commons/types/storages/types';
import { StoredImpressionWithMetadata }
  from '@splitsoftware/splitio-commons/types/sync/submitters/types';
import { ImpressionDTO } from '@splitsoftware/splitio-commons/types/types';
import { truncateTimeFrame } from '@splitsoftware/splitio-commons/src/utils/time';
import ImpressionObserver from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/ImpressionObserver';
import ImpressionCountsCacheInMemory
  from '@splitsoftware/splitio-commons/src/storages/inMemory/ImpressionCountsCacheInMemory';
import { groupByMetadata, metadataToHeaders, retry } from './utils';
import { SplitIO } from '@splitsoftware/splitio-commons/src/types';
import { ILogger } from '@splitsoftware/splitio-commons/src/logger/types';

/**
 * Constant to define the amount of Events to pop from Storage.
 */
const IMPRESSIONS_AMOUNT_DEFAULT = 1000;
/**
 * Amount of attempts to retry a POST request action.
 */
const MAX_RETRIES = 3;
/**
 * Factory that returns an Impressions submitter, capable of fetching the Impressions from the storage,
 * process them and sent to the Split's Services.
 *
 * @param {IPostTestImpressionsBulk}      postImpressionsBulk  HTTPClient API to perform the POST request.
 * @param {IImpressionsCacheAsync}        impressionsCache     Impressions Cache Storage reference.
 * @param {ImpressionObserver}            observer             The Impression Observer object for the dedupe process.
 * @param {ILogger}                       logger               The reference to the Synchronizer's Logger.
 * @param {number}                        impressionsPerPost   Amount of elements to pop from storage.
 * @param {number}                        maxRetries           Amount of attempt retries to perform the POST request.
 * @param {ImpressionCountsCacheInMemory} countsCache          The reference to the Impresion's Count Storage.
 * @returns {() => Promise<boolean>}
 */
export function impressionsSubmitterFactory(
  postImpressionsBulk: IPostTestImpressionsBulk,
  impressionsCache: IImpressionsCacheAsync,
  observer: ImpressionObserver,
  logger: ILogger,
  impressionsPerPost?: number,
  maxRetries?: number,
  countsCache?: ImpressionCountsCacheInMemory,
): () => Promise<boolean> {
  /**
   * Function to wrap the POST requests and retries attempt.
   *
   * @param {string} impressionsQueue  List of Events in EventData type.
   * @param {Record<string, string>}   metadataHeaders   The Headers corresponding to Metadata.
   */
  async function tryPostImpressionsBulk(
    impressionsQueue: string,
    metadataHeaders: Record<string, string>
  ) {
    await retry(
      () => postImpressionsBulk(impressionsQueue, metadataHeaders),
      maxRetries || MAX_RETRIES
    );
  }
  /**
   * Function to wrap a batch process of impressions, in order to make it iterative.
   *
   * @param {number} batchSize  A configurable amount of impressions to POP from Storage.
   * @returns {Promise<boolean>}
   */
  function processImpressionsBatch(batchSize: number = IMPRESSIONS_AMOUNT_DEFAULT) {
    return impressionsCache.popNWithMetadata(batchSize)
      .then(async (storedImpressions: StoredImpressionWithMetadata[]) => {
        const impressionsWithMetadataToPost: StoredImpressionWithMetadata[] = [];

        storedImpressions.forEach((impressionWithMetadata) => {
          const { i } = impressionWithMetadata;

          if (observer) {
            // Adds previous time if it is enabled
            // @ts-ignore
            i.pt = observer.testAndSet(i);
          }

          const now = Date.now();
          if (countsCache) {
            // Increments impression counter per featureName
            countsCache.track(i.f, now, 1);
          }

          // Checks if the impression should be added in queue to be sent
          // @ts-ignore
          if (!countsCache || !i.pt || i.pt < truncateTimeFrame(now)) {
            impressionsWithMetadataToPost.push(impressionWithMetadata);
          }
        });

        const impressionsWithMetadataProcessedToPost: { [metadataAsKey: string]: StoredImpressionWithMetadata[] } =
          groupByMetadata(impressionsWithMetadataToPost, 'm');

        const impressionMode: SplitIO.ImpressionsMode = countsCache ? 'OPTIMIZED' : 'DEBUG';

        const keys = Object.keys(impressionsWithMetadataProcessedToPost);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const impressions = impressionsWithMetadataProcessedToPost[key].map((data) => data.i);
          // @ts-ignore
          const metadata = impressionsWithMetadataProcessedToPost[key][0].m;
          const headers = Object.assign({}, metadataToHeaders(metadata), { SplitSDKImpressionsMode: impressionMode });
          // Group impressions by Feature key.
          const impressionsByFeature = groupByMetadata(impressions, 'f');

          let impressionsListToPost: { f: string; i: ImpressionDTO[]; }[] = [];
          Object.keys(impressionsByFeature).forEach((key) => {
            impressionsListToPost.push({
              f: JSON.parse(key),
              i: impressionsByFeature[key] as ImpressionDTO[],
            });
          });
          await tryPostImpressionsBulk(JSON.stringify(impressionsListToPost), headers);
        }

        const count = await impressionsCache.count();
        if (count > 0) await processImpressionsBatch(batchSize);
        return Promise.resolve(true);
      })
      .catch((e) => {
        logger.error(`An error occurred when processing Impressions: ${e}`);
        return false;
      });
  }
  return () => processImpressionsBatch(impressionsPerPost);
}
