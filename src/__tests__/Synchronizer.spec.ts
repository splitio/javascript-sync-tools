import { ISynchronizerSettings } from '../../types';

import { Synchronizer } from '../Synchronizer';
import InMemoryStorage from './pluggableStorage/InMemoryStorage';

describe('Synchronizer creation and execution', () => {

  const config: ISynchronizerSettings = {
    core: {
      authorizationKey: 'th1s_1sF4keAp1k31',
    },
    urls: {
      sdk: 'https://fake.split.io//api',
      events: 'https://fake.events.split.io/api',
      telemetry: 'https://fake.telemetry.split.io/api',
    },
    storage: {
      type: 'PLUGGABLE',
      prefix: 'InMemoryWrapper',
      wrapper: InMemoryStorage,
    },
  };

  test('Synchronizer execution fails because no Fetch API is present', async () => {
    // Create a synchronizer with a mocked _getFetch function that returns undefined
    const originalGetFetch = Synchronizer._getFetch;
    const _getFetchMock = jest.fn().mockReturnValue(undefined);
    Synchronizer._getFetch = _getFetchMock;
    const synchronizer = new Synchronizer(config);

    let error: any;
    const result = synchronizer.execute((e) => { error = e; });
    // Restore the original _getFetch function synchronously
    Synchronizer._getFetch = originalGetFetch;

    expect(await result).toBe(false);
    expect(error.message).toBe('Global Fetch API is not available');

    expect(_getFetchMock).toBeCalled();
  });

  test('Synchronizer execution fails because APIs check failed', async () => {
    const synchronizer = new Synchronizer(config);
    let error: any;
    expect(await synchronizer.execute((e) => { error = e; })).toBe(false);
    expect(error.message).toBe('Split endpoints health check failed');
  });

  describe('Pluggable Storage', () => {
    it('Instantiates the Synchronizer and [SUCCESSFULLY] initializes Pluggable Storage', async () => {
      const synchronizer = new Synchronizer(config);
      await expect(synchronizer.initializeStorage()).resolves.toBe(undefined);
    });

    it('Instantiate the Synchronizer and [FAILS] to initialize Pluggable Storage due to invalid wrapper', async () => { // @ts-ignore
      const synchronizer = new Synchronizer({ ...config, storage: { ...config.storage, wrapper: undefined } });
      await expect(synchronizer.initializeStorage()).rejects.toThrowError('Expecting pluggable storage `wrapper` in options, but no valid wrapper instance was provided.');
    });

    it('Instantiate the Synchronizer and [FAILS] to initialize Pluggable Storage due to wrapper connection error', async () => {
      const wrapperWithConnectionError = {
        ...config.storage.wrapper,
        connect: () => { throw new Error('Connection error');},
      };
      const synchronizer = new Synchronizer({ ...config, storage: { ...config.storage, wrapper: wrapperWithConnectionError } });

      jest.spyOn(synchronizer, '_checkEndpointHealth').mockImplementation(() => Promise.resolve(true));
      let error: any;
      await expect(synchronizer.execute((e) => { error = e; })).resolves.toBe(false);
      expect(error.message).toBe('Error when connecting storage. Error: Connection error');
    });

    it('Instantiate the Synchronizer and [FAILS] to release Pluggable Storage due to wrapper disconnection error', async () => {
      const wrapperWithConnectionError = {
        ...config.storage.wrapper,
        disconnect: () => Promise.reject(new Error('Disconnection error')),
      };
      const synchronizer = new Synchronizer({ ...config, storage: { ...config.storage, wrapper: wrapperWithConnectionError } });

      jest.spyOn(synchronizer, '_checkEndpointHealth').mockImplementation(() => Promise.resolve(true));
      let error: any;
      await expect(synchronizer.execute((e) => { error = e; })).resolves.toBe(false);
      expect(error.message).toBe('Error when disconnecting storage. Error: Disconnection error');
    });
  });

  describe('Synchronizer execution mode flow through setting definition', () => {
    const synchronizer = new Synchronizer(config);

    let executeSplitsAndSegmentsCallSpy: jest.SpyInstance;
    let executeImpressionsAndEventsCallSpy: jest.SpyInstance;

    beforeAll(() => {
      jest.spyOn(synchronizer, 'preExecute').mockImplementation(() => Promise.resolve());
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
