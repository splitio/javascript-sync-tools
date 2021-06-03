import { splitApiFactory } from '@splitsoftware/splitio-commons/src/services/splitApi';
import { ISplitApi } from '@splitsoftware/splitio-commons/src/services/types';
import { IStorageAsync } from '@splitsoftware/splitio-commons/src/storages/types';
import { ISettingsInternal } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/types';
import { SegmentsSynchroniser } from './synchronisers/SegmentsSynchroniser';
import { SplitsSynchroniser } from './synchronisers/SplitsSynchroniser';
import { SynchroniserStorageFactory } from './storages/SynchroniserStorage';
import fetch from 'node-fetch';
import { EventsSynchroniser } from './synchronisers/EventsSynchroniser';
import { ImpressionsSynchroniser } from './synchronisers/ImpressionsSynchroniser';
import { impressionObserverSSFactory }
  from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/impressionObserverSS';
import ImpressionCountsCacheInMemory
  from '@splitsoftware/splitio-commons/src/storages/inMemory/ImpressionCountsCacheInMemory';
import ImpressionObserver from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/ImpressionObserver';


/**
 * Main class to handle the Synchroniser execution.
 */
export class SynchroniserManager {
  /**
   * The local reference to the Synchroniser's Storage.
   */
  _storage!: IStorageAsync;
  /**
   * The local reference to the Synchroniser's SplitAPI instance.
   */
  _splitApi: ISplitApi;
  /**
   * The local reference to the SegmentsUpdater instance from @splitio/javascript-commons.
   */
  _segmentsSynchroniser!: SegmentsSynchroniser;
  /**
   * The local reference to the SplitUpdater instance from @splitio/javascript-commons.
   */
  _splitsSynchroniser!: SplitsSynchroniser;
  /**
   * The local reference to the EventsSynchroniser class.
   */
  _eventsSynchroniser!: EventsSynchroniser;
  /**
   * The local reference to the EventsSynchroniser class.
   */
  _impressionsSynchroniser!: ImpressionsSynchroniser;
  /**
   * The local reference to the Synchroniser's settings configurations.
   */
  _settings: ISettingsInternal;
  /**
   * The local reference for the Impression Observer.
   */
  _observer: ImpressionObserver;

  /**
   * @param  {ISettingsInternal} settings  Object containing the minimum settings required
   *                                       to instantiate the Manager.
   */
  constructor(settings: ISettingsInternal) {
    this._settings = settings;
    this._observer = impressionObserverSSFactory();
    /**
     * Function to wrapp whatever fetch the app is using.
     * Todo: Check if this belongs here.
     *
     * @returns {Promise<Response>}
     */
    const customFetch = () => {
      // eslint-disable-next-line no-undef
      return fetch as unknown as () => Promise<Response>;
    };
    /**
     * The Split's HTTPclient, required to make the requests to the API.
     */
    this._splitApi = splitApiFactory(
      settings,
      // @ts-ignore
      { getFetch: customFetch },
    );
  }
  /**
   * Function to set a storage.
   *
   * @returns {boolean}
   */
  initializeStorages(): Promise<boolean> {
    /**
     * The local reference to the defined Storage.
     *
     * @type {IStorageAsync}
     */
    this._storage = SynchroniserStorageFactory(this._settings);

    return Promise.resolve(true);
  }
  /**
   * Function to set all the required Synchronisers.
   *
   * @returns {Promise<boolean>}
   */
  initializeSynchronisers(): Promise<boolean> {
    const countsCache = this._settings.sync.impressionsMode === 'OPTIMIZED' ?
      new ImpressionCountsCacheInMemory() :
      undefined;

    try {
      this._segmentsSynchroniser = new SegmentsSynchroniser(
        this._splitApi.fetchSegmentChanges,
        this._settings,
        this._storage.segments,
      );
      this._splitsSynchroniser = new SplitsSynchroniser(
        this._splitApi.fetchSplitChanges,
        this._settings,
        this._storage.splits,
        this._storage.segments,
      );
      this._eventsSynchroniser = new EventsSynchroniser(
        this._splitApi.postEventsBulk,
        this._storage.events
      );
      this._impressionsSynchroniser = new ImpressionsSynchroniser(
        this._splitApi.postTestImpressionsBulk,
        this._storage.impressions,
        this._observer,
        countsCache,
      );
    } catch (error) {
      return Promise.reject(new Error('Error'));
    }
    return Promise.resolve(true);
  }
  /**
   * Method to start the Synchroniser execution.
   *
   * @throws {Error}
   */
  async execute() {
    console.log('# Synchroniser: Execute');

    const isStorageReady = await this.initializeStorages();
    if (!isStorageReady) throw new Error('Error: Synchronisers are not ready.');

    const areSyncsReady = await this.initializeSynchronisers();
    if (!areSyncsReady) throw new Error('Error: Some error occurred starting synchronisers. Exiting.');
    await this._splitsSynchroniser.getSplitChanges();
    console.log(`> Splits fetched: ${(await this._storage.splits.getAll()).length}`);
    console.log(`> Segments registered: ${await this._storage.segments.getRegisteredSegments()}`);
    await this._segmentsSynchroniser.getSegmentsChanges().then((result) => console.log('> Segments Results:', result));
    await this._eventsSynchroniser.synchroniseEvents().then((data) => console.log('> Events:', data));
    // await this._impressionsSynchroniser.synchroniseImpressions().then((data) => console.log('> Impresisons:', data));

    console.log('# Synchroniser: Execution ended');
  }
}
