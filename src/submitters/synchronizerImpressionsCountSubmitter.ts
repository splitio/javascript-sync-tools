
import { IPostTestImpressionsCount } from '@splitsoftware/splitio-commons/src/services/types';
import { ImpressionCountsPayload }
  from '@splitsoftware/splitio-commons/src/sync/submitters/types';
import { ImpressionCountsCacheInMemory }
  from '@splitsoftware/splitio-commons/src/storages/inMemory/ImpressionCountsCacheInMemory';
import { ILogger } from '@splitsoftware/splitio-commons/src/logger/types';

/**
 * Function to process Impressions Count data and transform it into request payload.
 *
 * @param {Record<string, number>} impressionsCount  The Impressions Count's data set.
 * @returns {ImpressionCountsPayload}
 */
const fromImpressionCountsCollector = (impressionsCount: Record<string, number>): ImpressionCountsPayload => {
  const pf = [];
  const keys = Object.keys(impressionsCount);

  for (let i = 0; i < keys.length; i++) {
    const splitted = keys[i].split('::');
    // eslint-disable-next-line no-magic-numbers
    if (splitted.length !== 2) continue;
    const featureName = splitted[0];
    const timeFrame = splitted[1];

    const impressionsInTimeframe = {
      f: featureName, // Test Name
      m: Number(timeFrame), // Time Frame
      rc: impressionsCount[keys[i]], // Count
    };

    pf.push(impressionsInTimeframe);
  }

  return { pf };
};

/**
 * Factory that returns an Impressions submitter, capable of fetching the Impressions from the storage,
 * process them and sent to the Split's Services.
 *
 * @param {IPostTestImpressionsBulk}      postClient              HTTPClient API to perform the POST request.
 * @param {ImpressionCountsCacheInMemory} impressionsCountsCache  Impressions Cache Storage reference.
 * @param {ILogger}                       logger                  The Synchronizer's Logger reference.
 * @returns {() => Promise<boolean>}
 */
export function impressionsCountSubmitterFactory(
  postClient: IPostTestImpressionsCount,
  impressionsCountsCache: ImpressionCountsCacheInMemory,
  logger: ILogger,
): () => Promise<boolean> {
  // eslint-disable-next-line no-async-promise-executor
  return async () => {
    const impressionsCountData = impressionsCountsCache.pop();
    if (Object.keys(impressionsCountData).length > 0) {
      const payload = fromImpressionCountsCollector(impressionsCountData);

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
