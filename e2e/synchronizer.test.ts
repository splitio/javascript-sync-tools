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
      authorizationKey: 'fakeapikeyfortesting',
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
      const _synchronizer = await createSynchronizer();
      await _synchronizer.execute();
    });

    it('saves [4] Splits as keys in Redis', async () => {
      const splits = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.split.*`);

      expect(splits).toHaveLength(4);
    });

    it('saves [2] Segments as keys in Redis', async () => {
      const segments = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.segment.*`);
      const segmentsRegistered = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.segments.*`);

      expect(segments.filter(x => !x.match(/.till$/))).toHaveLength(2);
      expect(segmentsRegistered).toHaveLength(1);
    });

    it('saves [2] Traffic Types keys', async () => {
      const trafficTypes = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.trafficType.*`);
      const ttAccount = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.account`);
      const ttTest = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.testTT`);
      const ttUser = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.user`);

      expect(trafficTypes).toHaveLength(2);
      expect(Number(ttAccount)).toBe(0);
      expect(Number(ttTest)).toBe(1);
      expect(Number(ttUser)).toBe(3);
    });
  });

  describe('Runs SDK Consumer, and', () => {
    beforeAll(async () => {
      await runSDKConsumer();
    });

    it('checks that [4] Impressions saved in Redis', async () => {
      const impressions = await _redisWrapper.popItems(`${REDIS_PREFIX}.impressions`, 100);

      expect(impressions).toHaveLength(4);
    });

    it('checks that [2] Events are saved in Redis', async () => {
      const events = await _redisWrapper.popItems(`${REDIS_PREFIX}.events`, 100);

      expect(events).toHaveLength(2);
    });

    it('checks that telemetry are saved in Redis', async () => {
      const telemetryKeys = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.telemetry`);

      console.log(JSON.stringify(telemetryKeys));
      expect(telemetryKeys.length).toBeGreaterThan(0);
    });
  });

  describe('Runs Synchronizer a [SECOND] time and', () => {
    beforeAll(async () => {
      const _synchronizer = await createSynchronizer();

      const hasExecute = await _synchronizer.execute();
      expect(hasExecute).toBe(true);
    });

    it('saves [4] Splits as keys in Redis', async () => {
      const splits = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.split.*`);

      expect(splits).toHaveLength(4);
    });

    it('saves [3] Traffic Types keys', async () => {
      const trafficTypes = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.trafficType.*`);
      const ttAccount = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.account`);
      const ttTest = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.testTT`);
      const ttUser = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.user`);

      expect(trafficTypes).toHaveLength(2);
      expect(Number(ttAccount)).toBe(2);
      expect(Number(ttTest)).toBe(0);
      expect(Number(ttUser)).toBe(2);
    });

    it('checks that [0] Impressions are saved in Redis', async () => {
      const impressions = await _redisWrapper.popItems(`${REDIS_PREFIX}.impressions`, 100);

      expect(impressions).toHaveLength(0);
    });

    it('checks that [0] Events are saved in Redis', async () => {
      const events = await _redisWrapper.popItems(`${REDIS_PREFIX}.events`, 100);

      expect(events).toHaveLength(0);
    });

    it('checks that telemetry has been removed from Redis', async () => {
      const telemetryKeys = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.telemetry`);

      expect(telemetryKeys).toEqual([]);
    });
  });
});

describe('Synchronizer e2e tests - InMemoryOperation - only Splits & Segments mode', () => {
  /**
   * Settings creation.
   */
  const settings: ISynchronizerSettings = {
    core: {
      authorizationKey: 'fakeapikeyfortesting',
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
    },
    scheduler: {
      // @ts-ignore. Not part of public API
      synchronizerMode: 'MODE_RUN_SPLIT_SEGMENTS',
    },
    logger: 'NONE',
    streamingEnabled: false,
  };

  const _synchronizer = new Synchronizer(settings);

  beforeAll(async () => {
    await _redisWrapper.connect();
    await flushRedis();
  });

  describe('Synchronizer runs the first time', () => {
    beforeAll(async () => {
      await _synchronizer.execute();
    });

    it('saves [4] Splits as keys in Redis', async () => {
      const splits = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.split.*`);

      // Check changeNumber(...71)
      expect(splits).toHaveLength(4);
    });

    it('saves new changeNumber value', async () => {
      const till = await _redisWrapper.get(`${REDIS_PREFIX}.splits.till`);

      expect(till).toBe('1619720346271');
    });

    it('saves [2] Segments as keys in Redis', async () => {
      const segments = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.segment.*`);
      const segmentsRegistered = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.segments.*`);

      expect(segments.filter(x => !x.match(/.till$/))).toHaveLength(2);
      expect(segmentsRegistered).toHaveLength(1);
    });

    it('saves [2] Traffic Types keys', async () => {
      const trafficTypes = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.trafficType.*`);
      const ttAccount = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.account`);
      const ttTest = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.testTT`);
      const ttUser = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.user`);

      expect(trafficTypes).toHaveLength(2);
      expect(Number(ttAccount)).toBe(0);
      expect(Number(ttTest)).toBe(1);
      expect(Number(ttUser)).toBe(3);
    });
  });

  describe('Synchronizer runs a second time, and', () => {
    beforeAll(async () => {
      await _synchronizer.execute();
    });

    it('runs again and saves [17] Splits as keys in Redis', async () => {
      const splits = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.split.*`);

      expect(splits).toHaveLength(4);
    });

    it('saves new changeNumber value', async () => {
      const till = await _redisWrapper.get(`${REDIS_PREFIX}.splits.till`);

      expect(till).toBe('1619720346272');
    });

    it('updates [4] Traffic Types keys\' values', async () => {
      const trafficTypes = await _redisWrapper.getKeysByPrefix(`${REDIS_PREFIX}.trafficType.*`);
      const ttAccount = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.account`);
      const ttTest = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.testTT`);
      const ttUser = await _redisWrapper.get(`${REDIS_PREFIX}.trafficType.user`);

      expect(trafficTypes).toHaveLength(2);
      expect(Number(ttAccount)).toBe(2);
      expect(Number(ttTest)).toBe(0);
      expect(Number(ttUser)).toBe(2);
    });
  });

  // @todo test remove split by fetching `archive` sstatus
});

describe('Synchronizer - only Splits & Segments mode', () => {
  let _synchronizer: Synchronizer;
  let executeSplitsAndSegmentsCallSpy: jest.SpyInstance;
  let executeImpressionsAndEventsCallSpy: jest.SpyInstance;

  beforeAll(async () => {
    _synchronizer = await createSynchronizer('MODE_RUN_SPLIT_SEGMENTS'); // @ts-ignore
    executeSplitsAndSegmentsCallSpy = jest.spyOn(_synchronizer, 'executeSplitsAndSegments'); // @ts-ignore
    executeImpressionsAndEventsCallSpy = jest.spyOn(_synchronizer, 'executeImpressionsAndEvents');
    await _synchronizer.execute();

    await _redisWrapper.connect();
  });

  it('executes Splits & Segments Producer Sync tasks', () => {
    expect(executeSplitsAndSegmentsCallSpy).toBeCalledTimes(1);
  });

  it('won\'t execute Events & Impressions Consumer Sync tasks', () => {
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
    _synchronizer = await createSynchronizer('MODE_RUN_EVENTS_IMPRESSIONS'); // @ts-ignore
    executeSplitsAndSegmentsCallSpy = jest.spyOn(_synchronizer, 'executeSplitsAndSegments'); // @ts-ignore
    executeImpressionsAndEventsCallSpy = jest.spyOn(_synchronizer, 'executeImpressionsAndEvents');
    await _synchronizer.execute();

    await _redisWrapper.connect();
  });

  it('executes Splits & Segments Producer Sync tasks', () => {
    expect(executeSplitsAndSegmentsCallSpy).toBeCalledTimes(0);
  });

  it('won\'t execute Events & Impressions Consumer Sync tasks', () => {
    expect(executeImpressionsAndEventsCallSpy).toBeCalledTimes(1);
  });

  afterAll(async () => {
    await _redisWrapper.disconnect();
  });
});
