import { ISynchronizerSettings } from '../../types';

import { Synchronizer } from '../Synchronizer';
import InMemoryStorage from './pluggableStorage/InMemoryStorage';

describe('Synchronizer creation and execution', () => {

  const config: ISynchronizerSettings = {
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
      type: 'PLUGGABLE',
      prefix: 'InMemoryWrapper',
      wrapper: InMemoryStorage,
    },
  };

  describe('Synchronizer creation fails because no node-fetch global is present', () => {
    const synchronizer = new Synchronizer(config);
    const _getFetchMock = jest.fn().mockReturnValue(undefined);
    Synchronizer._getFetch = _getFetchMock;

    it('and execution returns false', async () => {
      expect(await synchronizer.execute()).toBe(false);
    });
    it('_getFetch function returns undefined', () => {
      expect(Synchronizer._getFetch).toHaveBeenCalled();
    });
  });

  describe('Synchronizer execution halt because APIs check failed', () => {
    it('Fails to execute Synchronizer because APIs are not available', async () => {
      const synchronizer = new Synchronizer(config);
      expect(await synchronizer._checkEndpointHealth()).toBe(false);
    });
  });

  describe('Pluggable Storage initialization', () => {
    it('Instantiates the Synchronizer and [SUCCESSFULLY] initializes Pluggable Storage', async () => {
      const synchronizer = new Synchronizer(config);
      expect(await synchronizer.initializeStorages()).toBe(true);
    });

    it('Instantiate the Synchronizer and [FAILS] to initialize Pluggable Storage', async () => { // @ts-ignore
      const synchronizer = new Synchronizer({ ...config, storage: { ...config.storage, wrapper: undefined } });
      expect(await synchronizer.initializeStorages()).toBe(false);
    });
  });

  describe('Synchronizer execution mode flow through setting definition', () => {
    const synchronizer = new Synchronizer(config);

    let executeSplitsAndSegmentsCallSpy: jest.SpyInstance;
    let executeImpressionsAndEventsCallSpy: jest.SpyInstance;

    beforeAll(() => {
      jest.spyOn(synchronizer, 'preExecute').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(synchronizer, 'postExecute').mockImplementation(() => Promise.resolve());
      // @ts-ignore
      executeSplitsAndSegmentsCallSpy = jest.spyOn(synchronizer, 'executeSplitsAndSegments') // @ts-ignore
        .mockImplementation(() => Promise.resolve());
      // @ts-ignore
      executeImpressionsAndEventsCallSpy = jest.spyOn(synchronizer, 'executeImpressionsAndEvents') // @ts-ignore
        .mockImplementation(() => Promise.resolve());
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('runs [ALL] Synchronizer tasks.', async () => {
      // @ts-ignore
      synchronizer.settings.scheduler.synchronizerMode = 'MODE_RUN_ALL';

      await synchronizer.execute();
      expect(executeSplitsAndSegmentsCallSpy).toBeCalledTimes(1);
      expect(executeImpressionsAndEventsCallSpy).toBeCalledTimes(1);
    });

    it('runs [SPLITS & SEGMENTS] Synchronizer tasks only.', async () => {
      // @ts-ignore
      synchronizer.settings.scheduler.synchronizerMode = 'MODE_RUN_SPLIT_SEGMENTS';

      await synchronizer.execute();
      expect(executeSplitsAndSegmentsCallSpy).toBeCalledTimes(1);
      expect(executeImpressionsAndEventsCallSpy).toBeCalledTimes(0);
    });

    it('runs [EVENTS & IMPRESSIONS] Synchronizer tasks only.', async () => {
      // @ts-ignore
      synchronizer.settings.scheduler.synchronizerMode = 'MODE_RUN_EVENTS_IMPRESSIONS';

      await synchronizer.execute();
      expect(executeSplitsAndSegmentsCallSpy).toBeCalledTimes(0);
      expect(executeImpressionsAndEventsCallSpy).toBeCalledTimes(1);
    });
  });
});
