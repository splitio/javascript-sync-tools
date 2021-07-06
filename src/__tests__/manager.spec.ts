/* eslint-disable max-len */
import { SynchronizerManager } from '../manager';
import { synchronizerSettingsValidator } from '../settings';
import InMemoryStorage from './customStorage/InMemoryStorage';

describe('Manager creation and execution', () => {
  // Teardown
  const _settings = synchronizerSettingsValidator({
    core: {
      authorizationKey: 'th1s_1sF4keAp1k31',
    },
    urls: {
      // CDN having all the information for your environment
      sdk: 'https://fake.split.io//api',
      // Storage for your SDK events
      events: 'https://fake.events.split.io/api',
    },
    storage: {
      type: 'CUSTOM',
      prefix: 'InMemoryWrapper',
      wrapper: InMemoryStorage,
    },
  });

  describe('Synchronizer creation fails because no node-fetch global is present', () => {
    const _manager = new SynchronizerManager(_settings);
    const _getFetchMock = jest.fn().mockReturnValue(undefined);
    SynchronizerManager._getFetch = _getFetchMock;

    it('and manager execution returns false', async () => {
      expect(await _manager.execute()).toBe(false);
    });
    it('manager _getFetch function returns undefined', () => {
      expect(SynchronizerManager._getFetch).toHaveBeenCalled();
    });
  });

  describe('Synchronizer execution halt because APIs check failed', () => {
    it('Fails to execute Synchronizer because APIs are not available', async () => {
      const _manager = new SynchronizerManager(_settings);
      expect(await _manager._checkEndpointHealth()).toBe(false);
    });
  });

  describe('Custom Storage initialization', () => {
    it('Instantiates the Synchronizer Manager and [SUCCESSFULLY] initializes Custom Storage', async () => {
      const _manager = new SynchronizerManager(_settings);
      expect(await _manager.initializeStorages()).toBe(true);
    });

    it('Instantiate the Synchronizer Manager and [FAILS] to initialize Custom Storage', async () => {
      // @ts-ignore
      _settings.storage.wrapper = undefined;

      const _manager = new SynchronizerManager(_settings);
      expect(await _manager.initializeStorages()).toBe(false);
    });
  });

  describe('Synchronizer execution mode flow through setting definition', () => {
    const _manager = new SynchronizerManager(_settings);

    let executeSplitsAndSegmentsCallSpy: jest.SpyInstance;
    let executeImpressionsAndEventsCallSpy: jest.SpyInstance;

    beforeAll(() => {
      jest.spyOn(_manager, 'preExecute').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(_manager, 'postExecute').mockImplementation(() => Promise.resolve());
      executeSplitsAndSegmentsCallSpy = jest.spyOn(_manager, 'executeSplitsAndSegments').mockImplementation(() => Promise.resolve());
      executeImpressionsAndEventsCallSpy = jest.spyOn(_manager, 'executeImpressionsAndEvents').mockImplementation(() => Promise.resolve());
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('runs [ALL] Synchronizer tasks.', async () => {
      // @ts-ignore
      _manager._settings.synchronizerMode = 'MODE_RUN_ALL';

      await _manager.execute();
      expect(executeSplitsAndSegmentsCallSpy).toBeCalledTimes(1);
      expect(executeImpressionsAndEventsCallSpy).toBeCalledTimes(1);
    });

    it('runs [SPLITS & SEGMENTS] Synchronizer tasks only.', async () => {
      // @ts-ignore
      _manager._settings.synchronizerMode = 'MODE_RUN_SPLIT_SEGMENTS';

      await _manager.execute();
      expect(executeSplitsAndSegmentsCallSpy).toBeCalledTimes(1);
      expect(executeImpressionsAndEventsCallSpy).toBeCalledTimes(0);
    });

    it('runs [EVENTS & IMPRESSIONS] Synchronizer tasks only.', async () => {
      // @ts-ignore
      _manager._settings.synchronizerMode = 'MODE_RUN_EVENTS_IMPRESSIONS';

      await _manager.execute();
      expect(executeSplitsAndSegmentsCallSpy).toBeCalledTimes(0);
      expect(executeImpressionsAndEventsCallSpy).toBeCalledTimes(1);
    });
  });
});
