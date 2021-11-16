import { splitApiFactory } from '@splitsoftware/splitio-commons/src/services/splitApi';
import { IFetch, ISplitApi } from '@splitsoftware/splitio-commons/src/services/types';
import { IStorageAsync } from '@splitsoftware/splitio-commons/src/storages/types';
import { ISettings } from '@splitsoftware/splitio-commons/src/types';
import { SegmentsSynchronizer } from './synchronizers/SegmentsSynchronizer';
import { SplitsSynchronizer } from './synchronizers/SplitsSynchronizer';
import { SynchronizerStorageFactory } from './storages/SynchronizerStorage';
import fetch from 'node-fetch';
import { EventsSynchronizer } from './synchronizers/EventsSynchronizer';
import { ImpressionsSynchronizer } from './synchronizers/ImpressionsSynchronizer';
import { impressionObserverSSFactory }
  from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/impressionObserverSS';
import ImpressionCountsCacheInMemory
  from '@splitsoftware/splitio-commons/src/storages/inMemory/ImpressionCountsCacheInMemory';
import ImpressionObserver from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/ImpressionObserver';
import { ImpressionsCountSynchronizer } from './synchronizers/ImpressionsCountSynchronizer';
import synchronizerSettingsValidator from './settings';
import { validateApiKey } from '@splitsoftware/splitio-commons/src/utils/inputValidation';
import { SynchronizerConfigs } from './types';
import { InMemoryStorageFactory } from '@splitsoftware/splitio-commons/src/storages/inMemory/InMemoryStorage';
import { IEventsCacheAsync } from '@splitsoftware/splitio-commons/src/storages/types';
import { IImpressionsCacheAsync } from '@splitsoftware/splitio-commons/src/storages/types';
/**
 * Main class to handle the Synchronizer execution.
 */
export class Synchronizer {
  /**
   * The local reference to the Synchronizer's Storage.
   */
  _storage!: IStorageAsync;
  /**
   * The local reference to the Synchronizer's SplitAPI instance.
   */
  _splitApi: ISplitApi;
  /**
   * The local reference to the SegmentsUpdater instance from @splitio/javascript-commons.
   */
  _segmentsSynchronizer!: SegmentsSynchronizer;
  /**
   * The local reference to the SplitUpdater instance from @splitio/javascript-commons.
   */
  _splitsSynchronizer!: SplitsSynchronizer;
  /**
   * The local reference to the EventsSynchronizer class.
   */
  _eventsSynchronizer!: EventsSynchronizer;
  /**
   * The local reference to the ImpressionsSynchronizer class.
   */
  _impressionsSynchronizer!: ImpressionsSynchronizer;
  /**
   * The local reference to the ImpressionsCountSynchronizer class.
   */
  _impressionsCountSynchronizer!: ImpressionsCountSynchronizer;
  /**
   * The local reference to the Synchronizer's settings configurations.
   */
  _settings: ISettings & { synchronizerConfigs: SynchronizerConfigs };
  /**
   * The local reference for the Impression Observer.
   */
  _observer: ImpressionObserver;

  /**
   * @param  {ISettings} config  Configuration object used to instantiates the Synchronizer.
   */
  constructor(config: any) {
    this._observer = impressionObserverSSFactory();
    const settings = synchronizerSettingsValidator(config);

    if (!validateApiKey(settings.log, settings.core.authorizationKey)) {
      throw new Error('Unable to initialize Synchronizer task: invalid APIKEY.');
    }

    this._settings = settings;
    /**
     * The Split's HTTPclient, required to make the requests to the API.
     */
    this._splitApi = splitApiFactory(
      this._settings,
      { getFetch: Synchronizer._getFetch },
    );
  }

  /**
   * Function to check the health status of both Split and Events API.
   *
   * @returns {Promise<boolean>}
   */
  async _checkEndpointHealth(): Promise<boolean> {
    return await this._splitApi.getSdkAPIHealthCheck() &&
      await this._splitApi.getEventsAPIHealthCheck();
  }
  /**
   * Function to set a storage. Returns a Promise that will never be rejected.
   *
   * @returns {Promise<boolean>}
   */
  initializeStorages(): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
      // @ts-ignore
      this._storage = SynchronizerStorageFactory(
        this._settings,
        (error) => error ? rej() : res(true)
      );
      return true;
    }).catch((error) => {
      this._settings.log.error(`Error when initializing Storages: ${error}`);
      return false;
    });
  }
  /**
   * Function to set all the required Synchronizers.
   *
   * @returns {Promise<boolean>}
   */
  initializeSynchronizers(): Promise<boolean> {
    // @todo: Add Cli paramater to define impressionsMode.
    const countsCache = this._settings.sync.impressionsMode === 'OPTIMIZED' ?
      new ImpressionCountsCacheInMemory() :
      undefined;

    try {
      this._segmentsSynchronizer = new SegmentsSynchronizer(
        this._splitApi.fetchSegmentChanges,
        this._settings,
        this._storage.segments,
      );
      this._splitsSynchronizer = new SplitsSynchronizer(
        this._splitApi.fetchSplitChanges,
        this._settings,
        this._storage.splits,
        this._storage.segments,
        // @ts-ignore
        InMemoryStorageFactory({ log: this._settings.log }),
        // @ts-ignore
        InMemoryStorageFactory({ log: this._settings.log })
      );
      this._eventsSynchronizer = new EventsSynchronizer(
        this._splitApi.postEventsBulk,
        this._storage.events as IEventsCacheAsync,
        this._settings.log,
        this._settings.synchronizerConfigs.eventsPerPost,
        this._settings.synchronizerConfigs.maxRetries,
      );
      this._impressionsSynchronizer = new ImpressionsSynchronizer(
        this._splitApi.postTestImpressionsBulk,
        this._storage.impressions as IImpressionsCacheAsync,
        this._observer,
        this._settings.log,
        this._settings.synchronizerConfigs.impressionsPerPost,
        this._settings.synchronizerConfigs.maxRetries,
        countsCache,
      );
      if (countsCache) {
        this._impressionsCountSynchronizer = new ImpressionsCountSynchronizer(
          this._splitApi.postTestImpressionsCount,
          countsCache,
          this._settings.log,
        );
      }
    } catch (error) {
      this._settings.log.error(`Error when initializing Synchronizer: ${error}`);
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  }
  /**
   * Function to prepare for sync tasks. Checks for Fetch API availability and
   * initialize Syncs and Storages.
   *
   * @returns {Promise<boolean>}
   */
  async preExecute(): Promise<boolean> {
    if (Synchronizer._getFetch() === undefined) {
      console.log('Global fetch API is not available.');
      return false;
    }
    console.log('# Synchronizer: Execute');

    const areAPIsReady = await this._checkEndpointHealth();
    if (!areAPIsReady) return false;
    console.log('Split API and Events API ready.');

    const isStorageReady = await this.initializeStorages();
    if (!isStorageReady) {
      // @TODO fix message for programmatic API
      console.log('Custom Storage not ready. Run the cli with -d option for debugging information.');
      return false;
    }
    console.log(' > Storage setup:                  Ready');

    const areSyncsReady = await this.initializeSynchronizers();
    if (!areSyncsReady) return false;
    console.log(' > Synchronizers components setup: Ready');

    return true;
  }
  /**
   * Function to wrap actions to perform after the sync tasks have been executed.
   * Currently, it discconects from the Storage.
   */
  async postExecute(): Promise<void> {
    await this._storage.destroy();
  }
  /**
   * Method to start the Synchronizer execution.
   *
   * @returns {boolean}
   */
  async execute(): Promise<boolean> {
    const mode = this._settings.synchronizerConfigs?.synchronizerMode || 'MODE_RUN_ALL';
    const hasPreExecutionSucceded = await this.preExecute();
    if (!hasPreExecutionSucceded) return false;

    console.log('# Syncronization tasks');
    if (mode === 'MODE_RUN_ALL' || mode === 'MODE_RUN_SPLIT_SEGMENTS') await this.executeSplitsAndSegments(false);
    if (mode === 'MODE_RUN_ALL' || mode === 'MODE_RUN_EVENTS_IMPRESSIONS') {
      await this.executeImpressionsAndEvents(false);
    }

    this.postExecute();

    console.log('# Synchronizer: Execution ended');
    return true;
  }
  /**
   * Function to wrap the execution of the Split and Segment's synchronizers.
   *
   * @param {boolean} standalone  Flag to determine the function requires the preExecute conditions.
   */
  async executeSplitsAndSegments(standalone = true) {
    if (standalone) await this.preExecute();

    const isSplitsSyncReady = this._settings.synchronizerConfigs.inMemoryOperation ?
      await this._splitsSynchronizer.getSplitChangesInMemory() :
      await this._splitsSynchronizer.getSplitChanges();
    console.log(` > Splits Synchronizer task:       ${isSplitsSyncReady ? 'Successful   √' : 'Unsuccessful X'}`);
    const isSegmentsSyncReady = await this._segmentsSynchronizer.getSegmentsChanges();
    console.log(` > Segments Synchronizer task:     ${isSegmentsSyncReady ? 'Successful   √' : 'Unsuccessful X'}`);

    if (standalone) await this.postExecute();
  }
  /**
   * Function to wrap the execution of the Impressions and Event's synchronizers.
   *
   * @param {boolean} standalone  Flag to determine the function requires the preExecute conditions.
   */
  async executeImpressionsAndEvents(standalone = true) {
    if (standalone) await this.preExecute();

    const isEventsSyncReady = await this._eventsSynchronizer.synchroniseEvents();
    console.log(` > Events Synchronizer task:       ${isEventsSyncReady ? 'Successful   √' : 'Unsuccessful X'}`);
    const isImpressionsSyncReady = await this._impressionsSynchronizer.synchroniseImpressions();
    console.log(` > Impressions Synchronizer task:  ${isImpressionsSyncReady ? 'Successful   √' : 'Unsuccessful X'}`);

    if (this._impressionsCountSynchronizer) {
      const isImpressionsCountSyncReady = await this._impressionsCountSynchronizer.synchroniseImpressionsCount();
      console.log(
        ` > ImpressionsCount Synchronizer task:  ${isImpressionsCountSyncReady ? 'Successful   √' : 'Unsuccessful X'}`
      );
    }
  }
  /**
   * Function to set the Fetch function to perform the requests. It can be provided through
   * the NPM package, or fallbacks to the global Fetch function if available. In case
   * there is no fetch globally, returns undefined.
   *
   * @returns {IFetch|undefined}
   */
  static _getFetch(): IFetch | undefined {
    let _fetch;
    try {
      _fetch = require('node-fetch');
      // Handle node-fetch issue https://github.com/node-fetch/node-fetch/issues/1037
      if (typeof _fetch !== 'function') _fetch = _fetch.default;
    } catch (e) {
      _fetch = typeof fetch === 'function' ? fetch : undefined;
    }
    return _fetch;
  }
}
