import { Synchronizer } from '../src/index';
import { PREFIX, REDIS_PREFIX, REDIS_URL, SERVER_MOCK_URL } from './utils/constants';
import runSDKConsumer from './utils/SDKConsumerMode';
import redisAdapterWrapper from './utils/redisAdapterWrapper';
import { ISynchronizerSettings } from '../types';

let _redisWrapper = redisAdapterWrapper({ url: REDIS_URL });

// @TODO validate HTTP requests
const createSynchronizer = (synchronizerMode?: string) => {
  /**
   * Settings creation.
   */
  const settings: ISynchronizerSettings = {
    core: {
      authorizationKey: 'fakeSdkKeyForTesting',
    },
    urls: {
      sdk: SERVER_MOCK_URL,
      events: SERVER_MOCK_URL,
      telemetry: SERVER_MOCK_URL,
    },
    storage: {
      type: 'PLUGGABLE',
      prefix: PREFIX,
      wrapper: redisAdapterWrapper({ url: REDIS_URL }),
    },
    debug: true,
    scheduler: {
      // @ts-ignore. Not part of public API
      synchronizerMode,
    },
  };

  return new Synchronizer(settings);
};

/**
 * Function to flush REDIS db from all keys related to e2e tests.
 */
const flushRedis = async () => {
  const keys = await _redisWrapper.getKeysByPrefix(PREFIX);
  for (let i = 0; i < keys.length; i++) {
    await _redisWrapper.del(keys[i]);
  }
};

describe('Synchronizer e2e tests', () => {
  beforeAll(async () => {
    await _redisWrapper.connect();
    await flushRedis();
  });

  afterAll(async () => {
    await _redisWrapper.disconnect();
  });

  describe('Runs Synchronizer for the [FIRST] time, and', () => {
    beforeAll(async () => {
      const _synchronizer = createSynchronizer();
      await _synchronizer.execute();
    });

    test('saves [4] Splits as keys in Redis', async () => {
      const splits = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.split.*`);

      expect(splits).toHaveLength(4);
    });

    test('saves [2] Segments as keys in Redis', async () => {
      const segments = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.segment.*`);
      const segmentsRegistered = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.segments.*`);

      expect(segments.filter(x => !x.match(/.till$/))).toHaveLength(2);
      expect(segmentsRegistered).toHaveLength(1);
    });

    test('saves [2] Traffic Types keys', async () => {
      const trafficTypes = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.trafficType.*`);
      const ttAccount = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.account`);
      const ttTest = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.testTT`);
      const ttUser = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.user`);

      expect(trafficTypes).toHaveLength(2);
      expect(Number(ttAccount)).toBe(0);
      expect(Number(ttTest)).toBe(1);
      expect(Number(ttUser)).toBe(3);
    });

    test('saves flag set keys', async () => {
      const flagSets = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.flagSet.*`);
      const itemsSetA = await _redisWrapper.getItems(`${REDIS_PREFIX}.flagSet.set_a`);
      const itemsSetB = await _redisWrapper.getItems(`${REDIS_PREFIX}.flagSet.set_b`);
      const itemsInexistentSet = await _redisWrapper.getItems(`${REDIS_PREFIX}.flagSet.inexistent_set`);

      expect(flagSets.sort()).toEqual([`${REDIS_PREFIX}.flagSet.set_a`, `${REDIS_PREFIX}.flagSet.set_b`]);
      expect(itemsSetA.sort()).toEqual(['MATIAS_TEST', 'TEST_DOC']);
      expect(itemsSetB.sort()).toEqual(['TEST_DOC', 'TEST_MATIAS']);
      expect(itemsInexistentSet).toEqual([]);
    });
  });

  describe('Runs SDK Consumer with DEBUG impressions mode, and', () => {
    beforeAll(async () => {
      await runSDKConsumer('DEBUG');
    });

    test('checks that [4] impressions are saved in Redis', async () => {
      const impressions = await _redisWrapper.getItemsCount(`${REDIS_PREFIX}.impressions`);

      expect(impressions).toBe(4);
    });

    test('checks that [2] events are saved in Redis', async () => {
      const events = await _redisWrapper.getItemsCount(`${REDIS_PREFIX}.events`);

      expect(events).toBe(2);
    });

    test('checks that telemetry are saved in Redis', async () => {
      const telemetryKeys = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.telemetry`);

      expect(telemetryKeys.length).toBeGreaterThan(0);
    });
  });

  describe('Runs Synchronizer a [SECOND] time and', () => {
    beforeAll(async () => {
      const _synchronizer = createSynchronizer();

      const hasExecute = await _synchronizer.execute();
      expect(hasExecute).toBe(true);
    });

    test('saves [4] Splits as keys in Redis', async () => {
      const splits = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.split.*`);

      expect(splits).toHaveLength(4);
    });

    test('saves [3] Traffic Types keys', async () => {
      const trafficTypes = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.trafficType.*`);
      const ttAccount = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.account`);
      const ttTest = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.testTT`);
      const ttUser = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.user`);

      expect(trafficTypes).toHaveLength(2);
      expect(Number(ttAccount)).toBe(2);
      expect(Number(ttTest)).toBe(0);
      expect(Number(ttUser)).toBe(2);
    });

    test('saves flag set keys', async () => {
      const flagSets = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.flagSet.*`);
      const itemsSetA = await _redisWrapper.getItems(`${REDIS_PREFIX}.flagSet.set_a`);
      const itemsSetB = await _redisWrapper.getItems(`${REDIS_PREFIX}.flagSet.set_b`);
      const itemsSetC = await _redisWrapper.getItems(`${REDIS_PREFIX}.flagSet.set_c`);

      expect(flagSets.sort()).toEqual([`${REDIS_PREFIX}.flagSet.set_b`, `${REDIS_PREFIX}.flagSet.set_c`]);
      expect(itemsSetA).toEqual([]);
      expect(itemsSetB).toEqual(['TEST_MATIAS']);
      expect(itemsSetC).toEqual(['MATIAS_TEST']);
    });

    test('checks that [0] impressions are saved in Redis', async () => {
      const impressions = await _redisWrapper.getItemsCount(`${REDIS_PREFIX}.impressions`);
      expect(impressions).toBe(0);

      // SDK running in DEBUG mode should not save impression counts in Redis
      const impressionCountKeys = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.impressions.count`);
      expect(impressionCountKeys).toHaveLength(0);
    });

    test('checks that [0] Events are saved in Redis', async () => {
      const events = await _redisWrapper.getItemsCount(`${REDIS_PREFIX}.events`);

      expect(events).toBe(0);
    });

    test('checks that telemetry has been removed from Redis', async () => {
      const telemetryKeys = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.telemetry`);

      expect(telemetryKeys).toHaveLength(0);
    });
  });

  describe('Runs SDK Consumer with OPTIMIZED impression mode, and', () => {
    test('checks that impressions, impression counts, events and telemetry are saved in Redis', async () => {
      await runSDKConsumer('OPTIMIZED');

      const impressions = await _redisWrapper.getItemsCount(`${REDIS_PREFIX}.impressions`);
      expect(impressions).toBe(4);

      const impressionCountsKeys = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.impressions.count`);
      expect(impressionCountsKeys).toHaveLength(4);

      const events = await _redisWrapper.getItemsCount(`${REDIS_PREFIX}.events`);
      expect(events).toBe(2);

      const telemetryKeys = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.telemetry`);
      expect(telemetryKeys.length).toBeGreaterThan(0);
    });

    test('Run Synchronizer and check that data was popped from Redis and sent to Split BE', async () => {
      const _synchronizer = createSynchronizer();

      const hasExecute = await _synchronizer.execute();
      expect(hasExecute).toBe(true);

      // Impressions were popped
      const impressions = await _redisWrapper.getItems(`${REDIS_PREFIX}.impressions`);
      expect(impressions).toHaveLength(0);

      // Impression counts were popped
      const impressionCountKeys = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.impressions.count`);
      expect(impressionCountKeys).toHaveLength(0);

      // Events were popped
      const events = await _redisWrapper.getItems(`${REDIS_PREFIX}.events`);
      expect(events).toHaveLength(0);

      // Telemetry was popped
      const telemetryKeys = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.telemetry`);
      expect(telemetryKeys).toHaveLength(0);
    });
  });

  describe('Runs SDK Consumer with NONE impression mode, and', () => {
    test('checks that impression counts, unique keys, events and telemetry are saved in Redis', async () => {
      await runSDKConsumer('NONE');

      const impressions = await _redisWrapper.getItemsCount(`${REDIS_PREFIX}.impressions`);
      expect(impressions).toBe(0);

      const impressionCountsKeys = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.impressions.count`);
      expect(impressionCountsKeys).toHaveLength(4);

      const uniqueKeys = await _redisWrapper.getItemsCount(`${REDIS_PREFIX}.uniquekeys`);
      expect(uniqueKeys).toBe(4);

      const events = await _redisWrapper.getItemsCount(`${REDIS_PREFIX}.events`);
      expect(events).toBe(2);

      const telemetryKeys = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.telemetry`);
      expect(telemetryKeys.length).toBeGreaterThan(0);
    });

    test('Run Synchronizer and check that data was popped from Redis and sent to Split BE', async () => {
      const _synchronizer = createSynchronizer();

      const hasExecute = await _synchronizer.execute();
      expect(hasExecute).toBe(true);

      // Impression counts were popped
      const impressionCountKeys = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.impressions.count`);
      expect(impressionCountKeys).toHaveLength(0);

      // Unique keys were popped
      const uniqueKeys = await _redisWrapper.getItemsCount(`${REDIS_PREFIX}.uniquekeys`);
      expect(uniqueKeys).toBe(0);

      // Events were popped
      const events = await _redisWrapper.getItems(`${REDIS_PREFIX}.events`);
      expect(events).toHaveLength(0);

      // Telemetry was popped
      const telemetryKeys = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.telemetry`);
      expect(telemetryKeys).toHaveLength(0);
    });
  });

});

describe('Synchronizer e2e tests - InMemoryOperation - only Splits & Segments mode', () => {
  /**
   * Settings creation.
   */
  const settings: ISynchronizerSettings = {
    core: {
      authorizationKey: 'fakeSdkKeyForTesting',
    },
    urls: {
      sdk: SERVER_MOCK_URL,
      events: SERVER_MOCK_URL,
      telemetry: SERVER_MOCK_URL,
    },
    storage: {
      type: 'PLUGGABLE',
      prefix: PREFIX,
      wrapper: redisAdapterWrapper({ url: REDIS_URL }),
    },
    sync: {
      impressionsMode: 'OPTIMIZED',
      splitFilters: [{
        type: 'bySet',
        values: ['set_b'],
      }],
    },
    scheduler: {
      // @ts-ignore. Not part of public API
      synchronizerMode: 'MODE_RUN_FEATURE_FLAGS_AND_SEGMENTS',
    },
    logger: 'NONE',
    streamingEnabled: false,
  };

  const _synchronizer = new Synchronizer(settings);

  beforeAll(async () => {
    await _redisWrapper.connect();
    await flushRedis();
  });

  afterAll(async () => {
    await _redisWrapper.disconnect();
  });

  describe('Synchronizer runs the first time', () => {
    beforeAll(async () => {
      await _synchronizer.execute();
    });

    test('saves [2] Splits as keys in Redis that matches the flag sets filter', async () => {
      const splits = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.split.*`);

      // Check changeNumber(...71)
      expect(splits.sort()).toEqual([`${REDIS_PREFIX}.split.TEST_DOC`, `${REDIS_PREFIX}.split.TEST_MATIAS`]);
    });

    test('saves new changeNumber value', async () => {
      const till = await _redisWrapper.get(`${REDIS_PREFIX}.splits.till`);

      expect(till).toBe('1619720346271');
    });

    test('saves [1] Segments as keys in Redis', async () => {
      const segments = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.segment.*`);
      const segmentsRegistered = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.segments.*`);

      expect(segments.filter(x => !x.match(/.till$/))).toHaveLength(1);
      expect(segmentsRegistered).toHaveLength(1);
    });

    test('saves [1] Traffic Types key', async () => {
      const trafficTypes = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.trafficType.*`);
      const ttAccount = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.account`);
      const ttTest = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.testTT`);
      const ttUser = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.user`);

      expect(trafficTypes).toHaveLength(1);
      expect(Number(ttAccount)).toBe(0);
      expect(Number(ttTest)).toBe(0);
      expect(Number(ttUser)).toBe(2);
    });

    test('saves flag set keys considering the flag sets filter', async () => {
      const flagSets = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.flagSet.*`);
      const itemsSetA = await _redisWrapper.getItems(`${REDIS_PREFIX}.flagSet.set_a`);
      const itemsSetB = await _redisWrapper.getItems(`${REDIS_PREFIX}.flagSet.set_b`);
      const itemsInexistentSet = await _redisWrapper.getItems(`${REDIS_PREFIX}.flagSet.inexistent_set`);

      expect(flagSets).toEqual([`${REDIS_PREFIX}.flagSet.set_b`]);
      expect(itemsSetA).toEqual([]);
      expect(itemsSetB.sort()).toEqual(['TEST_DOC', 'TEST_MATIAS']);
      expect(itemsInexistentSet).toEqual([]);
    });
  });

  describe('Synchronizer runs a second time, and', () => {
    beforeAll(async () => {
      await _synchronizer.execute();
    });

    test('runs again and saves [1] Split as keys in Redis', async () => {
      const splits = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.split.*`);

      expect(splits).toEqual([`${REDIS_PREFIX}.split.TEST_MATIAS`]);
    });

    test('saves new changeNumber value', async () => {
      const till = await _redisWrapper.get(`${REDIS_PREFIX}.splits.till`);

      expect(till).toBe('1619720346272');
    });

    test('updates [1] Traffic Types keys values', async () => {
      const trafficTypes = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.trafficType.*`);
      const ttAccount = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.account`);
      const ttTest = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.testTT`);
      const ttUser = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.user`);

      expect(trafficTypes).toHaveLength(1);
      expect(Number(ttAccount)).toBe(0);
      expect(Number(ttTest)).toBe(0);
      expect(Number(ttUser)).toBe(1);
    });

    test('saves flag set keys', async () => {
      const flagSets = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.flagSet.*`);
      const itemsSetA = await _redisWrapper.getItems(`${REDIS_PREFIX}.flagSet.set_a`);
      const itemsSetB = await _redisWrapper.getItems(`${REDIS_PREFIX}.flagSet.set_b`);
      const itemsSetC = await _redisWrapper.getItems(`${REDIS_PREFIX}.flagSet.set_c`);

      expect(flagSets).toEqual([`${REDIS_PREFIX}.flagSet.set_b`]);
      expect(itemsSetA).toEqual([]);
      expect(itemsSetB).toEqual(['TEST_MATIAS']);
      expect(itemsSetC).toEqual([]);
    });
  });

  // @todo test remove split by fetching `archive` sstatus
});

describe('Synchronizer - only Splits & Segments mode', () => {
  let _synchronizer: Synchronizer;
  let executeSplitsAndSegmentsCallSpy: jest.SpyInstance;
  let executeImpressionsAndEventsCallSpy: jest.SpyInstance;

  beforeAll(async () => {
    _synchronizer = createSynchronizer('MODE_RUN_FEATURE_FLAGS_AND_SEGMENTS'); // @ts-ignore
    executeSplitsAndSegmentsCallSpy = jest.spyOn(_synchronizer, 'executeSplitsAndSegments'); // @ts-ignore
    executeImpressionsAndEventsCallSpy = jest.spyOn(_synchronizer, 'executeImpressionsAndEvents');
    await _synchronizer.execute();

    await _redisWrapper.connect();
  });

  test('executes Splits & Segments Producer Sync tasks', () => {
    expect(executeSplitsAndSegmentsCallSpy).toBeCalledTimes(1);
  });

  test('won\'t execute Events & Impressions Consumer Sync tasks', () => {
    expect(executeImpressionsAndEventsCallSpy).toBeCalledTimes(0);
  });

  afterAll(async () => {
    await _redisWrapper.disconnect();
  });
});

describe('Synchronizer - only Events & Impressions', () => {
  let _synchronizer: Synchronizer;
  let executeSplitsAndSegmentsCallSpy: jest.SpyInstance;
  let executeImpressionsAndEventsCallSpy: jest.SpyInstance;

  beforeAll(async () => {
    _synchronizer = createSynchronizer('MODE_RUN_EVENTS_AND_IMPRESSIONS'); // @ts-ignore
    executeSplitsAndSegmentsCallSpy = jest.spyOn(_synchronizer, 'executeSplitsAndSegments'); // @ts-ignore
    executeImpressionsAndEventsCallSpy = jest.spyOn(_synchronizer, 'executeImpressionsAndEvents');
    await _synchronizer.execute();

    await _redisWrapper.connect();
  });

  test('executes Splits & Segments Producer Sync tasks', () => {
    expect(executeSplitsAndSegmentsCallSpy).toBeCalledTimes(0);
  });

  test('won\'t execute Events & Impressions Consumer Sync tasks', () => {
    expect(executeImpressionsAndEventsCallSpy).toBeCalledTimes(1);
  });

  afterAll(async () => {
    await _redisWrapper.disconnect();
  });
});
