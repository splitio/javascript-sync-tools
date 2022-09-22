/* eslint-disable max-len */
import { ILogger } from '@splitsoftware/splitio-commons/src/logger/types';
import { IPostUniqueKeysBulkSs } from '@splitsoftware/splitio-commons/src/services/types';
import { fromUniqueKeysCollector } from '@splitsoftware/splitio-commons/src/storages/inMemory/UniqueKeysCacheInMemory';
import { UniqueKeysCachePluggable }
  from '@splitsoftware/splitio-commons/src/storages/pluggable/UniqueKeysCachePluggable';
import { UniqueKeysPayloadSs } from '@splitsoftware/splitio-commons/src/sync/submitters/types';
import { ISet, _Set } from '@splitsoftware/splitio-commons/src/utils/lang/sets';

export function uniqueKeysSubmitterFactory(
  postClient: IPostUniqueKeysBulkSs,
  uniqueKeysCache: UniqueKeysCachePluggable,
  logger: ILogger,
  uniqueKeysFetchSize?: number
  // @TODO maxRetries,
): () => Promise<boolean> {

  async function getPayload(): Promise<UniqueKeysPayloadSs | undefined> {
    const uniqueKeyItems = await uniqueKeysCache.popNRaw(uniqueKeysFetchSize);

    if (!uniqueKeyItems.length) return undefined;

    const mergedUniqueKeys = uniqueKeyItems.reduce<{ [featureName: string]: ISet<string> }>((accUniqueKeys, uniqueKeyItem) => {
      const featureNameKeys = accUniqueKeys[uniqueKeyItem.f];
      if (featureNameKeys) {
        uniqueKeyItem.ks.forEach(key => featureNameKeys.add(key));
      } else {
        accUniqueKeys[uniqueKeyItem.f] = new _Set(uniqueKeyItem.ks);
      }
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
