/* eslint-disable max-len */
import { ILogger } from '@splitsoftware/splitio-commons/src/logger/types';
import { IPostUniqueKeysBulkSs } from '@splitsoftware/splitio-commons/src/services/types';
import { fromUniqueKeysCollector } from '@splitsoftware/splitio-commons/src/storages/inMemory/UniqueKeysCacheInMemory';
import { UniqueKeysCachePluggable } from '@splitsoftware/splitio-commons/src/storages/pluggable/UniqueKeysCachePluggable';
import { UniqueKeysPayloadSs } from '@splitsoftware/splitio-commons/src/sync/submitters/types';
import { ISet, _Set } from '@splitsoftware/splitio-commons/src/utils/lang/sets';
import { retry } from './utils';

export function uniqueKeysSubmitterFactory(
  postClient: IPostUniqueKeysBulkSs,
  uniqueKeysCache: UniqueKeysCachePluggable,
  logger: ILogger,
  maxRetries?: number,
  uniqueKeysFetchSize?: number,
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

  return async function postData() {
    let payload: any;

    try {
      payload = await getPayload();
    } catch (e) {
      logger.error(`An error occurred when retrieving unique keys from storage: ${e}`);
      return false;
    }

    if (payload) {
      // POST data with retry attempts
      try {
        await retry(
          () => postClient(JSON.stringify(payload)),
          maxRetries
        );
      } catch (err) {
        logger.error(`An error occurred when submitting unique keys to Split: ${err}`);
        return false;
      }
    }

    return true;
  };
}
