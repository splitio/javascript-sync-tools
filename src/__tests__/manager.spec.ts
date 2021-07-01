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
    const _getFetchSpy = jest.spyOn(_manager, '_getFetch').mockReturnValue(undefined);
    it('and manager execution returns false', async () => {
      expect(await _manager.execute()).toBe(false);
    });
    it('manager _getFetch function returns undefined', () => {
      expect(_getFetchSpy).toHaveBeenCalled();
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
});
