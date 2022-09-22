import { ILogger } from '@splitsoftware/splitio-commons/src/logger/types';
import { IPostUniqueKeysBulkSs } from '@splitsoftware/splitio-commons/src/services/types';
import { fromUniqueKeysCollector } from '@splitsoftware/splitio-commons/src/storages/inMemory/UniqueKeysCacheInMemory';
import { UniqueKeysCachePluggable }
  from '@splitsoftware/splitio-commons/src/storages/pluggable/UniqueKeysCachePluggable';
import { UniqueKeysPayloadSs } from '@splitsoftware/splitio-commons/src/sync/submitters/types';
import { ISet } from '@splitsoftware/splitio-commons/src/utils/lang/sets';

export function uniqueKeysSubmitterFactory(
  postClient: IPostUniqueKeysBulkSs,
  uniqueKeysCache: UniqueKeysCachePluggable,
  logger: ILogger,
  uniqueKeysFetchSize?: number
  // @TODO maxRetries,
): () => Promise<boolean> {

  async function getPayload(): Promise<UniqueKeysPayloadSs | undefined> {
    const multipleUniqueKeys = (await uniqueKeysCache.popNRaw(uniqueKeysFetchSize))
      .map((uniqueKeys => JSON.parse(uniqueKeys) as { [featureName: string]: ISet<string> }));

    if (!multipleUniqueKeys.length) return undefined;

    const mergedUniqueKeys = multipleUniqueKeys.reduce((accUniqueKeys, currentUniqueKeys) => {
      Object.keys(currentUniqueKeys).forEach(featureName => {
        const featureNameKeys = accUniqueKeys[featureName];
        if (featureNameKeys) {
          currentUniqueKeys[featureName].forEach(key => featureNameKeys.add(key));
        } else {
          accUniqueKeys[featureName] = currentUniqueKeys[featureName];
        }
      });
      return accUniqueKeys;
    }, {});

    return fromUniqueKeysCollector(mergedUniqueKeys);
  }

  return async () => {
    try {
      const payload = await getPayload();
      if (payload) await postClient(JSON.stringify(payload));
    } catch (e) {
      logger.error(`An error occurred when processing unique keys: ${e}`);
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  };
}
