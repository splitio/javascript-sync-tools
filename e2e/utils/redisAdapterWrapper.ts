import { RedisAdapter } from '@splitsoftware/splitio-commons/src/storages/inRedis/RedisAdapter';
import { Logger } from '@splitsoftware/splitio-commons/src/logger/index';
import { InRedisStorageOptions } from '@splitsoftware/splitio-commons/src/storages/inRedis/';
import { IPluggableStorageWrapper } from '@splitsoftware/splitio-commons/src/storages/types';

// @TODO refactor: move to JS-commons, rename to `ioredisWrapper`, and reuse in JS SDK for Node
/**
 * Creates a storage wrapper that uses our RedisAdapter.
 * Operations fail until `connect` is resolved once the Redis 'ready' event is emitted.
 *
 * @param {Object} redisOptions  Redis options with the format expected at `settings.storage.options`.
 * @returns {IPluggableStorageWrapper} Storage wrapper instance.
 */
export default function redisAdapterWrapper(redisOptions: InRedisStorageOptions): IPluggableStorageWrapper {

  let redis: RedisAdapter;

  return {
    get(key) {
      return redis.get(key);
    },
    set(key, value) {
      return redis.set(key, value).then(value => value === 'OK');
    },
    getAndSet(key, value) {
      const getResult = redis.get(key);
      return redis.set(key, value).then(() => getResult);
    }, // @ts-ignore
    del(key) {
      return redis.del(key);
    },
    getKeysByPrefix(prefix) {
      return redis.keys(`${prefix}*`);
    },
    getMany(keys) {
      return redis.mget(...keys);
    },
    incr(key) {
      return redis.incr(key);
    },
    decr(key) {
      return redis.decr(key);
    }, // @ts-ignore
    pushItems(key, items) {
      return redis.rpush(key, items);
    },
    popItems(key, count) {
      // @TODO wrap rpop method in RedisAdapter
      // return redis.rpop(key, count);
      return redis.lrange(key, 0, count - 1).then(result => {
        return redis.ltrim(key, result.length, -1).then(() => result);
      });
    },
    getItemsCount(key) {
      return redis.llen(key);
    },
    itemContains(key, item) {
      return redis.sismember(key, item).then(matches => matches !== 0);
    }, // @ts-ignore
    addItems(key, items) {
      return redis.sadd(key, items);
    }, // @ts-ignore
    removeItems(key, items) {
      return redis.srem(key, items);
    },
    getItems(key) {
      return redis.smembers(key);
    },

    // @TODO check if connect should be idempotent or not
    connect() {
      return new Promise((res) => {
        const log = new Logger({ logLevel: 'INFO' });
        redis = new RedisAdapter(log, redisOptions);

        redis.on('ready', res);
        // There is no need to listen for redis 'error' event, because in that case ioredis calls will be rejected.
        // It is done to avoid getting the message `Unhandled error event: Error: connect ECONNREFUSED`.
        // Also, we cannot reject the connect promise on an error, because the SDK will not get ready
        // if the connection is established after the error.
        redis.on('error', () => { });
      });
    },
    disconnect() {
      return Promise.resolve(redis && redis.disconnect());
    },
  };
}
