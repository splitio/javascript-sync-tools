import { splitApiFactory } from '@splitsoftware/splitio-commons/src/services/splitApi';
import { ISplitApi } from '@splitsoftware/splitio-commons/src/services/types';
import { IStorageSync } from '@splitsoftware/splitio-commons/src/storages/types';
import { ISettingsInternal } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/types';
import { SegmentsSynchroniser } from './synchronisers/SegmentsSynchroniser';
import { SplitsSynchroniser } from './synchronisers/SplitsSynchroniser';
import { SynchroniserStorageFactory } from './storages/SplitStorage';
import fetch from 'node-fetch';

/**
 * Main class to handle the Synchroniser execution.
 */
export class SynchroniserManager {
  /**
   * The local reference to the Synchroniser's Storage.
   */
  _storage!: IStorageSync;
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
   * The local reference to the Synchroniser's settings configurations.
   */
  _settings: ISettingsInternal;

  /**
   * @param  {ISettingsInternal} settings  Object containing the minimum settings required
   *                                       to instantiate the Manager.
   */
  constructor(settings: ISettingsInternal) {
    this._settings = settings;
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
  setStorage(): Promise<boolean> {
    /**
     * The local reference to the defined Storage.
     *
     * @type {IStorageSync}
     */
    this._storage = SynchroniserStorageFactory(this._settings);

    return Promise.resolve(true);
  }
  /**
   * Function to set all the required Synchronisers.
   *
   * @returns {boolean}
   */
  setSynchronisers(): Promise<boolean> {
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

    const isStorageReady = await this.setStorage();
    if (!isStorageReady) throw new Error('Error: Synchronisers are not ready.');

    const areSyncsReady = await this.setSynchronisers();
    if (!areSyncsReady) throw new Error('Error: Some error occurred starting synchronisers. Exiting.');
    await this.synchroniseSplits();
    console.log(`> Splits fetched: ${this._storage.splits.getAll().length}`);
    console.log(`> Segments registered: ${this._storage.segments.getRegisteredSegments()}`);
    const test = await this.synchroniseSegments();
    // @ts-ignore
    console.log(`> Segments: ${test}`);

    console.log('# Synchroniser: Execution ended');
  }
  /**
   * Method to get Split Changes from Split's Backend and alocate them in the storage.
   *
   * @returns {Promise<boolean>}
   */
  synchroniseSplits(): Promise<boolean> {
    return this._splitsSynchroniser.getSplitChanges();
  }
  /**
   * Method to get the Segment Changes from Split's Backend and alocate the in the storage.
   *
   * @returns {Promise<boolean>}
   */
  synchroniseSegments(): Promise<boolean> {
    return this._segmentsSynchroniser.getSegmentsChanges();
  }
  // Consumer Methods:
  /**
   * Send Impressions obtained from the custom storage to the
   * Split's backend.
   *
   * @throws {Error}
   */
  synchroniseImpressions() {
    throw Error('Method not implemented');
  }
  /**
   * Send Events obtained from the custom storage to the
   * Split's backend.
   *
   * @throws {Error}
   */
  synchroniseEvents() {
    throw Error('Method not implemented');
  }
}
