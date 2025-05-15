import { splitApiFactory } from '@splitsoftware/splitio-commons/src/services/splitApi';
import { ISplitApi } from '@splitsoftware/splitio-commons/src/services/types';
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
import { IEventsCacheAsync } from '@splitsoftware/splitio-commons/src/storages/types';
import { IImpressionsCacheAsync } from '@splitsoftware/splitio-commons/src/storages/types';
import { telemetrySubmitterFactory } from './submitters/telemetrySubmitter';
import { uniqueKeysSubmitterFactory } from './submitters/uniqueKeysSubmitter';
import { UniqueKeysCachePluggable } from '@splitsoftware/splitio-commons/src/storages/pluggable/UniqueKeysCachePluggable';
import { ImpressionCountsCachePluggable } from '@splitsoftware/splitio-commons/src/storages/pluggable/ImpressionCountsCachePluggable';
import { getFetch } from './synchronizers/getFetch';

/**
 * Main class to handle the Synchronizer execution.
 */
export class Synchronizer {
  /**
   * The local reference to the Synchronizer's Storage.
   */
  private _storage!: IStorageAsync;
  /**
   * The local reference to the Synchronizer's SplitAPI instance.
   */
  private _splitApi: ISplitApi;
  /**
   * The local reference to the SegmentsUpdater instance from `@splitio/javascript-commons`.
   */
  private _segmentsSynchronizer!: SegmentsSynchronizer;
  /**
   * The local reference to the SplitUpdater instance from `@splitio/javascript-commons`.
   */
  private _splitsSynchronizer!: SplitsSynchronizer;
  /**
   * The local reference to the EventsSynchronizer class.
   */
  private _eventsSubmitter!: () => Promise<boolean>;
  /**
   * The local reference to the ImpressionsSynchronizer class.
   */
  private _impressionsSubmitter!: () => Promise<boolean>;
  /**
   * The local reference to the ImpressionsCountSynchronizer class.
   */
  private _impressionCountsSubmitter?: () => Promise<boolean>;
  /**
   * The local reference to the unique keys submitter.
   */
  private _uniqueKeysSubmitter?: () => Promise<boolean>;
  /**
   * The local reference to the telemetry submitter.
   */
  private _telemetrySubmitter?: () => Promise<boolean>;

  /**
   * The local reference to the Synchronizer's settings configurations.
   */
  settings: ISettings & ISynchronizerSettings;
  /**
   * The local reference for the Impression Observer.
   */
  private _observer: ImpressionObserver;

  /**
   * @param config - Configuration object used to instantiate the Synchronizer.
   */
  constructor(config: ISynchronizerSettings) {
    this._observer = impressionObserverSSFactory();
    const settings = synchronizerSettingsValidator(config);

    if (!validateApiKey(settings.log, settings.core.authorizationKey)) {
      throw new Error('Unable to initialize Synchronizer task: invalid SDK key.');
    }

    this.settings = settings;
    /**
     * The Split's HTTPclient, required to make the requests to the API.
     */
    this._splitApi = splitApiFactory(
      this.settings,
      {
        getFetch,
        getOptions(settings: ISettings) {
          // User provided options take precedence
          if (settings.sync.requestOptions) return settings.sync.requestOptions;
        },
      },
      telemetryTrackerFactory() // no-op telemetry tracker
    );
  }

  /**
   * Function to check the health status of Split APIs (SDK and Events services).
   *
   * @returns A Promise that resolves to `true` if both services are healthy, `false` otherwise.
   */
  private async _checkEndpointHealth() {
    return await Promise.all([
      this._splitApi.getSdkAPIHealthCheck(),
      this._splitApi.getEventsAPIHealthCheck(),
    ]).then((results) => results.every((result) => result));
  }
  /**
   * Function to set a storage.
   *
   * @returns A Promise that resolves when the storage is ready. It can reject if the storage is not properly configured (e.g., invalid wrapper) or the wrapper fails to connect.
   */
  private initializeStorage(): Promise<void> {
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
  private initializeSynchronizers() {
    // @todo: Add Cli parameter to define impressionsMode.
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
      this._storage,
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
   * @returns A promise that resolves if the synchronizer is ready to execute. It rejects with an error,
   * for example, if the Fetch API is not available, Split API is not responding, or Storage connection fails.
   */
  private async preExecute(): Promise<void> {
    const log = this.settings.log;
    if (!getFetch()) throw new Error('Global Fetch API is not available');
    log.info('Synchronizer: Execute');

    const areAPIsReady = await this._checkEndpointHealth();
    if (!areAPIsReady) throw new Error('Health check of Split API endpoints failed');
    log.info('Split API ready');

    await this.initializeStorage();

    log.info('Storage setup ready');

    this.initializeSynchronizers();
  }
  /**
   * Function to wrap actions to perform after the sync tasks have been executed.
   * Currently, it disconnects from the Storage.
   *
   * @returns A promise that resolves if the synchronizer has successfully disconnected from the storage. Otherwise, it rejects with an error.
   */
  private async postExecute(): Promise<void> {
    try {
      await this._storage.destroy();
    } catch (error) {
      throw new Error(`Error when disconnecting storage. ${error}`);
    }
  }
  /**
   * Method to start the Synchronizer execution.
   *
   * @param cb - Optional error-first callback to be invoked when the synchronization ends. The callback will be invoked with an error as first argument if the synchronization fails.
   * @returns A promise that resolves to `true` if the synchronization was successful, `false` otherwise.
   */
  async execute(cb?: (err?: any) => void): Promise<boolean> {
    try {
      // @ts-ignore @TODO define synchronizerMode config param
      const mode = this.settings.scheduler.synchronizerMode || 'MODE_RUN_ALL';

      await this.preExecute();

      let errorMessage;
      if (mode === 'MODE_RUN_ALL' || mode === 'MODE_RUN_FEATURE_FLAGS_AND_SEGMENTS') {
        if (!await this.executeSplitsAndSegments(false)) errorMessage = 'Feature flags and/or segments synchronization failed';
      }
      if (mode === 'MODE_RUN_ALL' || mode === 'MODE_RUN_EVENTS_AND_IMPRESSIONS') {
        if (!await this.executeImpressionsAndEvents(false)) errorMessage = 'Impressions and/or events synchronization failed';
      }

      // Disconnect from storage before throwing synchronization error
      await this.postExecute();
      if (errorMessage) throw new Error(errorMessage);

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
   * Function to wrap the execution of the feature flags and segments synchronizers.
   *
   * @param standalone - Flag to determine the function requires the preExecute conditions.
   * @returns A promise that resolves to a boolean value indicating if feature flags and segments were successfully fetched and stored.
   */
  private async executeSplitsAndSegments(standalone = true) {
    if (standalone) await this.preExecute();

    // @TODO optimize SplitChangesUpdater to reduce storage operations ("inMemoryOperation" mode)
    const isSplitsSyncSuccessful = await this._splitsSynchronizer.getSplitChanges();

    this.settings.log.debug(`Feature flags Synchronizer task: ${isSplitsSyncSuccessful ? 'Successful' : 'Unsuccessful'}`);
    const isSegmentsSyncSuccessful = await this._segmentsSynchronizer.getSegmentsChanges();
    this.settings.log.debug(`Segments Synchronizer task: ${isSegmentsSyncSuccessful ? 'Successful' : 'Unsuccessful'}`);

    if (standalone) await this.postExecute();

    return isSplitsSyncSuccessful && isSegmentsSyncSuccessful;
  }
  /**
   * Function to wrap the execution of the Impressions and Event's synchronizers.
   *
   * @param standalone - Flag to determine the function requires the preExecute conditions.
   * @returns A promise that resolves to a boolean value indicating if impressions and events were successfully popped from the storage and sent to Split.
   */
  private async executeImpressionsAndEvents(standalone = true) {
    const log = this.settings.log;
    if (standalone) await this.preExecute();

    const isEventsSyncSuccessful = await this._eventsSubmitter();
    log.debug(`Events Synchronizer task: ${isEventsSyncSuccessful ? 'Successful' : 'Unsuccessful'}`);
    const isImpressionsSyncSuccessful = await this._impressionsSubmitter();
    log.debug(`Impressions Synchronizer task: ${isImpressionsSyncSuccessful ? 'Successful' : 'Unsuccessful'}`);

    let isSyncSuccessful = isEventsSyncSuccessful && isImpressionsSyncSuccessful;

    if (this._impressionCountsSubmitter) {
      const isImpressionCountsSyncSuccessful = await this._impressionCountsSubmitter();
      isSyncSuccessful = isSyncSuccessful && isImpressionCountsSyncSuccessful;
      log.debug(`ImpressionCounts Synchronizer task: ${isImpressionCountsSyncSuccessful ? 'Successful' : 'Unsuccessful'}`);
    }

    if (this._uniqueKeysSubmitter) {
      const isUniqueKeysSyncSuccessful = await this._uniqueKeysSubmitter();
      isSyncSuccessful = isSyncSuccessful && isUniqueKeysSyncSuccessful;
      log.debug(`UniqueKeys Synchronizer task: ${isUniqueKeysSyncSuccessful ? 'Successful' : 'Unsuccessful'}`);
    }

    if (this._telemetrySubmitter) {
      const isTelemetrySyncSuccessful = await this._telemetrySubmitter();
      // if telemetry sync fails, we don't return false, since it's not a critical operation
      log.debug(`Telemetry Synchronizer task: ${isTelemetrySyncSuccessful ? 'Successful' : 'Unsuccessful'}`);
    }

    return isSyncSuccessful;
  }
}
