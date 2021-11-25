/* eslint-disable */
// @ts-nocheck
import RedisAdapter from '@splitsoftware/splitio-commons/src/storages/inRedis/RedisAdapter';
import { Logger } from '@splitsoftware/splitio-commons/src/logger/index';
import { InRedisStorageOptions } from '@splitsoftware/splitio-commons/src/storages/inRedis/';

/**
 * Wrapper for our RedisAdapter.
 *
 * @param {Object} redisOptions  Redis options with the format expected at `settings.storage.options`.
 * @returns {import("@splitsoftware/splitio-commons/types/storages/types").IPluggableStorageWrapper} Wrapper for IORedis client.
 */
function redisAdapterWrapper(redisOptions: InRedisStorageOptions) {

  let redis;
  // eslint-disable-next-line no-unused-vars
  let redisError = false;

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
    },
    del(key) {
      return redis.del(key);
    },
    getKeysByPrefix(prefix) {
      return redis.keys(`${prefix}*`);
    },
    getByPrefix(prefix) {
      return this.getKeysByPrefix(prefix).then(keys => redis.mget(...keys));
    },
    getMany(keys) {
      return redis.mget(...keys);
    },
    incr(key) {
      return redis.incr(key);
    },
    decr(key) {
      return redis.decr(key);
    },
    pushItems(key, items) {
      return redis.rpush(key, items);
    },
    popItems(key, count) {
      return redis.lrange(key, 0, count - 1).then(result => {
        return redis.ltrim(key, result.length, -1).then(() => result);
      });
    },
    getItemsCount(key) {
      // if (redisError) return Promise.reject(redisError);
      return redis.llen(key);
    },
    itemContains(key, item) {
      // if (redisError) return Promise.reject(redisError);
      return redis.sismember(key, item).then(matches => matches !== 0);
    },
    addItems(key, items) {
      return redis.sadd(key, items);
    },
    removeItems(key, items) {
      return redis.srem(key, items);
    },
    getItems(key) {
      return redis.smembers(key);
    },
    connect(): Promise<void> {
      const log = new Logger({ logLevel: 'INFO' });
      redis = new RedisAdapter(log, redisOptions);
      let retriesCount = 0;

      return new Promise((res, rej) => {
        redis.on('error', (e) => {
          console.log('Connecting to redis, attempt #', retriesCount);
          retriesCount++;
          if (retriesCount === 10) {
            this.close();
            rej(new Error('Connection timeout retries'));
          }
          redisError = e;
        });

        redis.on('connect', () => {
          redisError = false;
          res();
        });
      });
    },
    disconnect(): Promise<void> {
      return Promise.resolve(redis && redis.disconnect()); // close the connection
    },
  };
}

export default redisAdapterWrapper;

