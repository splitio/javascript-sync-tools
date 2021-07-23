// @ts-nocheck
/* eslint-disable no-magic-numbers */
import { Synchronizer, synchronizerSettingsValidator } from '../src/';
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
  const settings = synchronizerSettingsValidator({
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
  });

  return new Synchronizer(settings);
};

const _redisStorage = redisAdapterWrapper({ options: { url: REDIS_URL } });

describe('Synchronizer e2e tests', () => {
  beforeAll(async (done) => {
    // @ts-ignore
    _redisServer = _redisStorage;
    await _redisServer.connect();

    done();
  });

  afterAll(async (done) => {
    await _redisServer.close();
    done();
  });

  describe('Runs Synchronizer for the [FIRST] time, and', () => {
    beforeAll(async (done) => {
      const manager = await createSynchronizer();
      await manager.initializeStorages();
      await manager.initializeSynchronizers();
      await manager.execute();

      done();
    });

    it('saves [17] Splits as keys in Redis', async () => {
      const splits = await _redisServer.getKeysByPrefix(`${REDIS_PREFIX}.split*`);

      expect(splits).toHaveLength(18);
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

    it('checks that [17] Impressions saved in Redis', async () => {
      const impressions = await _redisServer.popItems(`${REDIS_PREFIX}.impressions`, 100);

      expect(impressions).toHaveLength(17);
    });

    it('checks that [2] Events are saved in Redis', async () => {
      const events = await _redisServer.popItems(`${REDIS_PREFIX}.events`, 100);

      expect(events).toHaveLength(2);
    });
  });

  describe('Runs Synchronizer a [SECOND] time', () => {
    beforeAll(async () => {
      const manager = await createSynchronizer();
      await manager.initializeStorages();
      await manager.initializeSynchronizers();
      await manager.execute();

      const hasExecute = await manager.execute();
      expect(hasExecute).toBe(true);
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

describe('Synchronizer - only Splits & Segments mode', () => {
  let manager: Synchronizer;
  let executeSplitsAndSegmentsCallSpy;
  let executeImpressionsAndEventsCallSpy;

  beforeAll(async (done) => {
    manager = await createSynchronizer();
    // @ts-ignore
    manager._settings.synchronizerConfigs.synchronizerMode = 'MODE_RUN_SPLIT_SEGMENTS';
    await manager.initializeStorages();
    await manager.initializeSynchronizers();
    executeSplitsAndSegmentsCallSpy = jest.spyOn(manager, 'executeSplitsAndSegments');
    executeImpressionsAndEventsCallSpy = jest.spyOn(manager, 'executeImpressionsAndEvents');
    await manager.execute();

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
  let manager: Synchronizer;
  let executeSplitsAndSegmentsCallSpy;
  let executeImpressionsAndEventsCallSpy;

  beforeAll(async (done) => {
    manager = await createSynchronizer();
    // @ts-ignore
    manager._settings.synchronizerConfigs.synchronizerMode = 'MODE_RUN_EVENTS_IMPRESSIONS';
    await manager.initializeStorages();
    await manager.initializeSynchronizers();
    executeSplitsAndSegmentsCallSpy = jest.spyOn(manager, 'executeSplitsAndSegments');
    executeImpressionsAndEventsCallSpy = jest.spyOn(manager, 'executeImpressionsAndEvents');
    await manager.execute();

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
