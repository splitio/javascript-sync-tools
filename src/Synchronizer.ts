import { splitApiFactory } from '@splitsoftware/splitio-commons/src/services/splitApi';
import { IFetch, ISplitApi } from '@splitsoftware/splitio-commons/src/services/types';
import { IStorageAsync, ITelemetryCacheAsync } from '@splitsoftware/splitio-commons/src/storages/types';
import { ISettings } from '@splitsoftware/splitio-commons/src/types';
import { SegmentsSynchronizer } from './synchronizers/SegmentsSynchronizer';
import { SplitsSynchronizer } from './synchronizers/SplitsSynchronizer';
import { synchronizerStorageFactory } from './storages/synchronizerStorage';
import { eventsSubmitterFactory } from './submitters/eventsSubmitter';
import { impressionsSubmitterFactory } from './submitters/impressionsSubmitter';
import { impressionObserverSSFactory } from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/impressionObserverSS';
import { ImpressionCountsCacheInMemory } from '@splitsoftware/splitio-commons/src/storages/inMemory/ImpressionCountsCacheInMemory';
import { ImpressionObserver } from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/ImpressionObserver';
import { telemetryTrackerFactory } from '@splitsoftware/splitio-commons/src/trackers/telemetryTracker';
import { impressionCountsSubmitterFactory } from './submitters/impressionCountsSubmitter';
import { synchronizerSettingsValidator } from './settings';
import { validateApiKey } from '@splitsoftware/splitio-commons/src/utils/inputValidation';
import { ISynchronizerSettings } from '../types';
import { InMemoryStorageFactory } from '@splitsoftware/splitio-commons/src/storages/inMemory/InMemoryStorage';
import { IEventsCacheAsync } from '@splitsoftware/splitio-commons/src/storages/types';
import { IImpressionsCacheAsync } from '@splitsoftware/splitio-commons/src/storages/types';
import { telemetrySubmitterFactory } from './submitters/telemetrySubmitter';
import { uniqueKeysSubmitterFactory } from './submitters/uniqueKeysSubmitter';
import { UniqueKeysCachePluggable } from '@splitsoftware/splitio-commons/src/storages/pluggable/UniqueKeysCachePluggable';
import { ImpressionCountsCachePluggable } from '@splitsoftware/splitio-commons/src/storages/pluggable/ImpressionCountsCachePluggable';
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
  _eventsSubmitter!: () => Promise<boolean>;
  /**
   * The local reference to the ImpressionsSynchronizer class.
   */
  _impressionsSubmitter!: () => Promise<boolean>;
  /**
   * The local reference to the ImpressionsCountSynchronizer class.
   */
  _impressionCountsSubmitter?: () => Promise<boolean>;
  /**
   * The local reference to the unique keys submitter.
   */
  _uniqueKeysSubmitter?: () => Promise<boolean>;
  /**
   * The local reference to the telemetry submitter.
   */
  _telemetrySubmitter?: () => Promise<boolean>;

  /**
   * The local reference to the Synchronizer's settings configurations.
   */
  settings: ISettings & ISynchronizerSettings;
  /**
   * The local reference for the Impression Observer.
   */
  _observer: ImpressionObserver;

  /**
   * @param  {ISynchronizerSettings} config  Configuration object used to instantiates the Synchronizer.
   */
  constructor(config: ISynchronizerSettings) {
    this._observer = impressionObserverSSFactory();
    const settings = synchronizerSettingsValidator(config);

    if (!validateApiKey(settings.log, settings.core.authorizationKey)) {
      throw new Error('Unable to initialize Synchronizer task: invalid APIKEY.');
    }

    this.settings = settings;
    /**
     * The Split's HTTPclient, required to make the requests to the API.
     */
    this._splitApi = splitApiFactory(
      this.settings,
      { getFetch: Synchronizer._getFetch },
      telemetryTrackerFactory() // no-op telemetry tracker
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
   * Function to set a storage.
   *
   * @returns {Promise<void>} A Promise that resolves when the storage is ready. It can reject if the storage is not properly configured (e.g., invalid wrapper) or the wrapper fails to connect.
   */
  initializeStorage(): Promise<void> {
    return new Promise<void>((res, rej) => {
      // @ts-ignore
      this._storage = synchronizerStorageFactory(
        this.settings,
        (error) => error ? rej(error) : res()
      );
    }).catch((error) => {
      throw new Error(`Error when connecting storage. ${error}`);
    });
  }
  /**
   * Function to set all the required Synchronizers.
   */
  initializeSynchronizers() {
    // @todo: Add Cli paramater to define impressionsMode.
    const countsCache = this.settings.sync.impressionsMode === 'OPTIMIZED' ?
      new ImpressionCountsCacheInMemory() :
      undefined;

    this._segmentsSynchronizer = new SegmentsSynchronizer(
      this._splitApi.fetchSegmentChanges,
      this.settings,
      this._storage.segments,
    );
    this._splitsSynchronizer = new SplitsSynchronizer(
      this._splitApi.fetchSplitChanges,
      this.settings,
      this._storage.splits,
      this._storage.segments,
      // @ts-ignore
      InMemoryStorageFactory({ settings: this.settings }),
      // @ts-ignore
      InMemoryStorageFactory({ settings: this.settings })
    );
    this._eventsSubmitter = eventsSubmitterFactory(
      this.settings.log,
      this._splitApi.postEventsBulk,
      this._storage.events as IEventsCacheAsync,
      this.settings.scheduler.eventsPerPost,
      this.settings.scheduler.maxRetries,
    );
    this._impressionsSubmitter = impressionsSubmitterFactory(
      this.settings.log,
      this._splitApi.postTestImpressionsBulk,
      this._storage.impressions as IImpressionsCacheAsync,
      this._observer,
      this.settings.scheduler.impressionsPerPost,
      this.settings.scheduler.maxRetries,
      countsCache,
    );
    this._impressionCountsSubmitter = impressionCountsSubmitterFactory(
      this.settings.log,
      this._splitApi.postTestImpressionsCount,
      this._storage.impressionCounts as ImpressionCountsCachePluggable, // ATM we are ignoring counts from `countsCache` and only sending the ones from the storage.
      this.settings.scheduler.maxRetries,
      countsCache,
    );
    this._uniqueKeysSubmitter = uniqueKeysSubmitterFactory(
      this.settings.log,
      this._splitApi.postUniqueKeysBulkSs,
      this._storage.uniqueKeys as UniqueKeysCachePluggable,
      this.settings.scheduler.maxRetries,
    );
    this._telemetrySubmitter = telemetrySubmitterFactory(
      this.settings.log,
      this._splitApi,
      this._storage.telemetry as ITelemetryCacheAsync,
    );
  }
  /**
   * Function to prepare for sync tasks. Checks for Fetch API availability and initialize Syncs and Storages.
   *
   * @returns {Promise<void>} A promise that resolves if the synchronizer is ready to execute. It rejects with an error,
   * for example, if the Fetch API is not available, Split API are not available, or Storage connection fails.
   */
  async preExecute(): Promise<void> {
    const log = this.settings.log;
    if (!Synchronizer._getFetch()) throw new Error('Global Fetch API is not available');
    log.info('Synchronizer: Execute');

    const areAPIsReady = await this._checkEndpointHealth();
    if (!areAPIsReady) throw new Error('Split endpoints health check failed');
    log.info('Split API and Events API ready');

    await this.initializeStorage();

    log.info('Storage setup ready');

    this.initializeSynchronizers();
  }
  /**
   * Function to wrap actions to perform after the sync tasks have been executed.
   * Currently, it disconects from the Storage.
   *
   * @returns {Promise<void>} A promise that resolves if the synchronizer has successfully disconnected from the storage. Otherwise, it rejects with an error.
   */
  async postExecute(): Promise<void> {
    try {
      await this._storage.destroy();
    } catch (error) {
      throw new Error(`Error when disconnecting storage. ${error}`);
    }
  }
  /**
   * Method to start the Synchronizer execution.
   *
   * @param {Function?} cb Optional error-first callback to be invoked when the synchronization ends. The callback will be invoked with an error as first argument if the synchronization fails.
   * @returns {Promise<boolean>}
   */
  async execute(cb?: (err?: any) => void): Promise<boolean> {
    try {
      // @ts-ignore @TODO define synchronizerMode config param
      const mode = this.settings.scheduler.synchronizerMode || 'MODE_RUN_ALL';

      await this.preExecute();


      if (mode === 'MODE_RUN_ALL' || mode === 'MODE_RUN_SPLIT_SEGMENTS') {
        await this.executeSplitsAndSegments(false);
      }
      if (mode === 'MODE_RUN_ALL' || mode === 'MODE_RUN_EVENTS_IMPRESSIONS') {
        await this.executeImpressionsAndEvents(false);
      }

      await this.postExecute();

      this.settings.log.info('Synchronizer: Execution ended successfully');
      cb && cb();
      return true;
    } catch (error) {
      this.settings.log.error(`Synchronizer: Execution ended unsuccessfully with error: ${error}`);
      cb && cb(error);
      return false;
    }
  }
  // @TODO remove standalone param for cleaner code
  /**
   * Function to wrap the execution of the Split and Segment's synchronizers.
   *
   * @param {boolean} standalone  Flag to determine the function requires the preExecute conditions.
   */
  private async executeSplitsAndSegments(standalone = true) {
    if (standalone) await this.preExecute();

    // @TODO optimize SplitChangesUpdater to reduce storage operations ("inMemoryOperation" mode)
    const isSplitsSyncReady = await this._splitsSynchronizer.getSplitChanges();

    this.settings.log.debug(`Splits Synchronizer task: ${isSplitsSyncReady ? 'Successful' : 'Unsuccessful'}`);
    const isSegmentsSyncReady = await this._segmentsSynchronizer.getSegmentsChanges();
    this.settings.log.debug(`Segments Synchronizer task: ${isSegmentsSyncReady ? 'Successful' : 'Unsuccessful'}`);

    if (standalone) await this.postExecute();
  }
  /**
   * Function to wrap the execution of the Impressions and Event's synchronizers.
   *
   * @param {boolean} standalone  Flag to determine the function requires the preExecute conditions.
   */
  private async executeImpressionsAndEvents(standalone = true) {
    const log = this.settings.log;
    if (standalone) await this.preExecute();


    const isEventsSyncReady = await this._eventsSubmitter();
    log.debug(`Events Synchronizer task: ${isEventsSyncReady ? 'Successful' : 'Unsuccessful'}`);
    const isImpressionsSyncReady = await this._impressionsSubmitter();
    log.debug(`Impressions Synchronizer task: ${isImpressionsSyncReady ? 'Successful' : 'Unsuccessful'}`);

    if (this._impressionCountsSubmitter) {
      const isImpressionCountsSyncReady = await this._impressionCountsSubmitter();
      log.debug(`ImpressionCounts Synchronizer task: ${isImpressionCountsSyncReady ? 'Successful' : 'Unsuccessful'}`);
    }

    if (this._uniqueKeysSubmitter) {
      const isUniqueKeysSyncReady = await this._uniqueKeysSubmitter();
      log.debug(`UniqueKeys Synchronizer task: ${isUniqueKeysSyncReady ? 'Successful' : 'Unsuccessful'}`);
    }

    if (this._telemetrySubmitter) {
      const isTelemetrySyncReady = await this._telemetrySubmitter();
      log.debug(`Telemetry Synchronizer task: ${isTelemetrySyncReady ? 'Successful' : 'Unsuccessful'}`);
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
      // Try to access global fetch if `node-fetch` package couldn't be imported (e.g., not in a Node environment)
      // eslint-disable-next-line no-undef
      _fetch = typeof fetch === 'function' ? fetch : undefined;
    }
    return _fetch;
  }
}
