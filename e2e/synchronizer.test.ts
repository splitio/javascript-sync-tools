/* eslint-disable no-magic-numbers */
// @ts-nocheck
import { Synchronizer } from '../src/index';
import { ICustomStorageWrapper }
  from '@splitsoftware/splitio-commons/src/storages/types';
import { PREFIX, REDIS_PREFIX, REDIS_URL, SERVER_MOCK_URL } from './utils/constants';
import runSDKConsumer from './utils/SDKConsumerMode';
import redisAdapterWrapper from './utils/inRedisService';
import { SynchronizerConfigs } from '../src/types';

// @ts-ignore
let _redisServer: ICustomStorageWrapper;

/**
 * Function to create a Synchronizer instance/task.
 *
 * @returns {Synchronizer}
 */
const createSynchronizer = () => {
  const synchronizerConfigs: SynchronizerConfigs = {
    synchronizerMode: 'MODE_RUN_ALL',
  };
  /**
   * Settings creation.
   */
  const settings = {
    core: {
      authorizationKey: 'fakeapikeyfortesting',
    },
    urls: {
      sdk: SERVER_MOCK_URL,
      events: SERVER_MOCK_URL,
    },
    storage: {
      type: 'CUSTOM_TEST',
      prefix: PREFIX,
      // @ts-ignore
      wrapper: redisAdapterWrapper({ options: { url: REDIS_URL } }),
    },
    sync: {
      impressionsMode: 'OPTIMIZED',
    },
    synchronizerConfigs,
    logger: 'NONE',
    streamingEnabled: false,
    debug: true,
  };

  return new Synchronizer(settings);
};

const _redisStorage = redisAdapterWrapper({ options: { url: REDIS_URL } });

/**
 * Function to flush REDIS db from all keys related to e2e tests.
 */
const flushRedis = async () => {
  const keys = await _redisServer.getKeysByPrefix(PREFIX);
  for (let i = 0; i < keys.length; i++) {
    await _redisServer.del(keys[i]);
  }
};

describe('Synchronizer e2e tests', () => {
  beforeAll(async (done) => {
    // @ts-ignore
    _redisServer = _redisStorage;
    await _redisServer.connect();
    await flushRedis();

    done();
  });

  afterAll(async (done) => {
    await _redisServer.close();
    done();
  });

  describe('Runs Synchronizer for the [FIRST] time, and', () => {
    beforeAll(async (done) => {
      const _synchronizer = await createSynchronizer();
      await _synchronizer.initializeStorages();
      await _synchronizer.initializeSynchronizers();
      await _synchronizer.execute();

      done();
    });

    it('saves [16] Splits as keys in Redis', async () => {
      const splits = await _redisServer.getKeysByPrefix(`${REDIS_PREFIX}.split.*`);

      expect(splits).toHaveLength(16);
    });

    it('saves [2] Segments as keys in Redis', async () => {
      const segments = await _redisServer.getKeysByPrefix(`${REDIS_PREFIX}.segment.*`);
      const segmentsRegistered = await _redisServer.getKeysByPrefix(`${REDIS_PREFIX}.segments.*`);

      expect(segments).toHaveLength(6);
      expect(segmentsRegistered).toHaveLength(1);
    });
  });

  describe('Runs SDK Consumer, and', () => {
    beforeAll(async () => {
      await runSDKConsumer();
    });

    it('checks that [16] Impressions saved in Redis', async () => {
      const impressions = await _redisServer.popItems(`${REDIS_PREFIX}.impressions`, 100);

      expect(impressions).toHaveLength(16);
    });

    it('checks that [2] Events are saved in Redis', async () => {
      const events = await _redisServer.popItems(`${REDIS_PREFIX}.events`, 100);

      expect(events).toHaveLength(2);
    });
  });

  describe('Runs Synchronizer a [SECOND] time', () => {
    beforeAll(async () => {
      const _synchronizer = await createSynchronizer();
      await _synchronizer.initializeStorages();
      await _synchronizer.initializeSynchronizers();

      const hasExecute = await _synchronizer.execute();
      expect(hasExecute).toBe(true);
    });

    it('saves [17] Splits as keys in Redis', async () => {
      const splits = await _redisServer.getKeysByPrefix(`${REDIS_PREFIX}.split.*`);

      expect(splits).toHaveLength(17);
    });
    it('checks that [0] Impressions are saved in Redis', async () => {
      const impressions = await _redisServer.popItems(`${REDIS_PREFIX}.impressions`, 100);

      expect(impressions).toHaveLength(0);
    });

    it('checks that [0] Events are saved in Redis', async () => {
      const events = await _redisServer.popItems(`${REDIS_PREFIX}.events`, 100);

      expect(events).toHaveLength(0);
    });
  });
});

describe('Synchronizer e2e tests - InMemoryOperation - only Splits & Segments mode', () => {
  const synchronizerConfigs: SynchronizerConfigs = {
    synchronizerMode: 'MODE_RUN_SPLIT_SEGMENTS',
    inMemoryOperation: true,
  };
  /**
   * Settings creation.
   */
  const settings = {
    core: {
      authorizationKey: 'fakeapikeyfortesting',
    },
    urls: {
      sdk: SERVER_MOCK_URL,
      events: SERVER_MOCK_URL,
    },
    storage: {
      type: 'CUSTOM_TEST',
      prefix: PREFIX,
      // @ts-ignore
      wrapper: redisAdapterWrapper({ options: { url: REDIS_URL } }),
    },
    sync: {
      impressionsMode: 'OPTIMIZED',
    },
    synchronizerConfigs,
    logger: 'NONE',
    streamingEnabled: false,
  };

  const _synchronizer = new Synchronizer(settings);

  beforeAll(async () => {
    // @ts-ignore
    _redisServer = _redisStorage;
    await _redisServer.connect();
    await flushRedis();

    // eslint-disable-next-line max-len
    const mockSplit = '{"trafficTypeName":"account","name":"old_split","trafficAllocation":100,"trafficAllocationSeed":466758093,"seed":-2090341508,"status":"ACTIVE","killed":true,"defaultTreatment":"off","changeNumber":1564514736413,"algo":2,"configurations":{},"conditions":[{"conditionType":"ROLLOUT","matcherGroup":{"combiner":"AND","matchers":[{"keySelector":{"trafficType":"account","attribute":null},"matcherType":"ALL_KEYS","negate":false,"userDefinedSegmentMatcherData":null,"whitelistMatcherData":null,"unaryNumericMatcherData":null,"betweenMatcherData":null,"booleanMatcherData":null,"dependencyMatcherData":null,"stringMatcherData":null}]},"partitions":[{"treatment":"on","size":0},{"treatment":"off","size":100}],"label":"default rule"}]}';
    await _redisServer.set(`${PREFIX}.SPLITIO.split.old_split`, mockSplit);

    // await _synchronizer.set;
    await _synchronizer.initializeStorages();
    await _synchronizer.initializeSynchronizers();
  });

  describe('Synchronizer runs the first time', () => {
    beforeAll(async () => {
      await _synchronizer.execute();
    });

    it('saves [16] Splits as keys in Redis', async () => {
      const splits = await _redisServer.getKeysByPrefix(`${REDIS_PREFIX}.split.*`);

      expect(splits).toHaveLength(16);
    });

    it('saves [2] Segments as keys in Redis', async () => {
      const segments = await _redisServer.getKeysByPrefix(`${REDIS_PREFIX}.segment.*`);
      const segmentsRegistered = await _redisServer.getKeysByPrefix(`${REDIS_PREFIX}.segments.*`);

      expect(segments).toHaveLength(6);
      expect(segmentsRegistered).toHaveLength(1);
    });

    it('saves [4] Traffic Types keys', async () => {
      const trafficTypes = await _redisServer.getKeysByPrefix(`${REDIS_PREFIX}.trafficType.*`);
      const ttAccount = await _redisServer.get(`${REDIS_PREFIX}.trafficType.account`);
      const ttTest = await _redisServer.get(`${REDIS_PREFIX}.trafficType.testTT`);

      expect(trafficTypes).toHaveLength(4);
      expect(Number(ttAccount)).toBe(5);
      expect(Number(ttTest)).toBe(1);
    });
  });

  describe('Synchronizer runs a second time', () => {
    beforeAll(async () => {
      await _synchronizer.execute();
    });

    it('runs again and saves [17] Splits as keys in Redis', async () => {
      const splits = await _redisServer.getKeysByPrefix(`${REDIS_PREFIX}.split.*`);

      expect(splits).toHaveLength(17);
    });

    it('updates [4] Traffic Types keys\' values', async () => {
      const trafficTypes = await _redisServer.getKeysByPrefix(`${REDIS_PREFIX}.trafficType.*`);
      const ttAccount = await _redisServer.get(`${REDIS_PREFIX}.trafficType.account`);
      const ttTest = await _redisServer.get(`${REDIS_PREFIX}.trafficType.testTT`);

      expect(trafficTypes).toHaveLength(4);
      expect(Number(ttAccount)).toBe(6);
      expect(Number(ttTest)).toBe(0);
    });
  });
});

describe('Synchronizer - only Splits & Segments mode', () => {
  let _synchronizer: Synchronizer;
  let executeSplitsAndSegmentsCallSpy;
  let executeImpressionsAndEventsCallSpy;

  beforeAll(async (done) => {
    _synchronizer = await createSynchronizer();
    // @ts-ignore
    _synchronizer._settings.synchronizerConfigs.synchronizerMode = 'MODE_RUN_SPLIT_SEGMENTS';
    await _synchronizer.initializeStorages();
    await _synchronizer.initializeSynchronizers();
    executeSplitsAndSegmentsCallSpy = jest.spyOn(_synchronizer, 'executeSplitsAndSegments');
    executeImpressionsAndEventsCallSpy = jest.spyOn(_synchronizer, 'executeImpressionsAndEvents');
    await _synchronizer.execute();

    // @ts-ignore
    _redisServer = _redisStorage;
    await _redisServer.connect();

    done();
  });

  it('executes Splits & Segments Producer Sync tasks', () => {
    expect(executeSplitsAndSegmentsCallSpy).toBeCalledTimes(1);
  });

  it('won\'t execute Events & Impressions Consumer Sync tasks', () => {
    expect(executeImpressionsAndEventsCallSpy).toBeCalledTimes(0);
  });

  afterAll(async (done) => {
    await _redisServer.close();
    done();
  });
});

describe('Synchronizer - only Events & Impressions', () => {
  let _synchronizer: Synchronizer;
  let executeSplitsAndSegmentsCallSpy;
  let executeImpressionsAndEventsCallSpy;

  beforeAll(async (done) => {
    _synchronizer = await createSynchronizer();
    // @ts-ignore
    _synchronizer._settings.synchronizerConfigs.synchronizerMode = 'MODE_RUN_EVENTS_IMPRESSIONS';
    await _synchronizer.initializeStorages();
    await _synchronizer.initializeSynchronizers();
    executeSplitsAndSegmentsCallSpy = jest.spyOn(_synchronizer, 'executeSplitsAndSegments');
    executeImpressionsAndEventsCallSpy = jest.spyOn(_synchronizer, 'executeImpressionsAndEvents');
    await _synchronizer.execute();

    // @ts-ignore
    _redisServer = _redisStorage;
    await _redisServer.connect();

    done();
  });

  it('executes Splits & Segments Producer Sync tasks', () => {
    expect(executeSplitsAndSegmentsCallSpy).toBeCalledTimes(0);
  });

  it('won\'t execute Events & Impressions Consumer Sync tasks', () => {
    expect(executeImpressionsAndEventsCallSpy).toBeCalledTimes(1);
  });

  afterAll(async (done) => {
    await _redisServer.close();
    done();
  });
});
