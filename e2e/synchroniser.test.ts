/* eslint-disable no-magic-numbers */
import { SynchronizerManager } from '../src/manager';
import { synchronizerSettingsValidator } from '../src/settings';
import redisAdapterWrapperFactory from './utils/CustomInRedisWrapper';
import { ICustomStorageWrapper }
  from '@splitsoftware/splitio-commons/src/storages/types';
import { PREFIX, REDIS_PREFIX, REDIS_URL, SERVER_MOCK_URL } from './utils/constants';
import runSDKConsumer from './utils/SDKConsumerMode';

let manager: SynchronizerManager;
// @ts-ignore
const _redisServer = redisAdapterWrapperFactory(REDIS_URL) as ICustomStorageWrapper;


describe('Synchroniser e2e tests', () => {
  beforeAll(async (done) => {
    await _redisServer.connect();
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
        wrapper: redisAdapterWrapperFactory(REDIS_URL),
      },
      sync: {
        impressionsMode: 'OPTIMIZED',
      },
      // debug: true,
      logger: 'NONE',
      streamingEnabled: false,
    });

    manager = new SynchronizerManager(settings);
    await manager.initializeStorages();
    await manager.initializeSynchronizers();

    done();
  });

  afterAll(async () => {
    await _redisServer.close();
  });
  describe('Check that Redis DB is empty', () => {
    it('it flushes the REDIS DB', async () => {
      // @ts-ignore
      await _redisServer.flushDb();
      const keys = await _redisServer.getKeysByPrefix('*');

      expect(keys).toHaveLength(0);
    });
  });

  describe('Runs Synchronizer for the first time, and', () => {
    beforeAll(async () => {
      await manager.execute();
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

  describe('runs SDK Consumer, and', () => {
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

  describe('Runs Synchronizer [SECOND} time', () => {
    beforeAll(async () => {
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
  // Assert if the impressions and events were removed from redis and that /impressions and /event endpoints
  //were properly called.
});

