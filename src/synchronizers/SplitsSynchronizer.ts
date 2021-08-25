import { IFetchSplitChanges } from '@splitsoftware/splitio-commons/src/services/types';
import splitChangesFetcherFactory from '@splitsoftware/splitio-commons/src/sync/polling/fetchers/splitChangesFetcher';
import { splitChangesUpdaterFactory }
  from '@splitsoftware/splitio-commons/src/sync/polling/updaters/splitChangesUpdater';
import { ISettingsInternal } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/types';
import { ISegmentsCacheAsync, ISplitsCacheAsync, IStorageSync }
  from '@splitsoftware/splitio-commons/types/storages/types';

type ISplitChangesUpdater = (noCache?: boolean) => Promise<boolean>;

/**
 * Class that manages all the Splits entities related actions.
 */
export class SplitsSynchronizer {
  /**
   * The local reference to the Synchronizer's Split Storage.
   */
  private _segmentsStorage;
  /**
   * The local reference to the Synchronizer's Segments Storage.
   */
  private _splitsStorage;
  /**
   * The local reference to the Fetch implementation required to perform requests.
   */
  private _fetcher;
  /**
   * The local reference to the SplitUpdater from @splitio/javascript-commons.
   */
  private _splitUpdater?: ISplitChangesUpdater;
  /**
   * The local reference to the Synchronizer's settings configurations.
   */
  private _settings;
  /**
   * The local reference to the InMemory cache used when InMemoryOperation mode is enabled.
   */
  private _inMemoryStorage: IStorageSync;

  /**
   * @param {IFetchSplitChanges}   splitFetcher     The SplitChanges fetcher from SplitAPI.
   * @param {ISettings}            settings         The Synchronizer's settings.
   * @param {ISplitsCacheAsync}    splitsStorage    The reference to the current Split Storage.
   * @param {ISegmentsCacheAsync}  segmentsStorage  The reference to the current Cache Storage.
   * @param {IStorageSync}         inMemoryStorage  The reference to local InMemoryStorage cache.
   */
  constructor(
    splitFetcher: IFetchSplitChanges,
    settings: ISettingsInternal,
    splitsStorage: ISplitsCacheAsync,
    segmentsStorage: ISegmentsCacheAsync,
    inMemoryStorage: IStorageSync,
  ) {
    this._splitsStorage = splitsStorage;
    this._segmentsStorage = segmentsStorage;
    this._settings = settings;
    this._fetcher = splitChangesFetcherFactory(splitFetcher);
    this._splitUpdater = undefined;
    this._inMemoryStorage = inMemoryStorage;
  }

  /**
   * Function to use the SplitUpdater, in order fetch and store the Splits from the BE.
   *
   * @returns {Promise<boolean>}
   */
  getSplitChanges(): Promise<boolean> {
    this._splitUpdater = splitChangesUpdaterFactory(
      this._settings.log,
      this._fetcher,
      this._splitsStorage,
      this._segmentsStorage
    );
    return this._splitUpdater();
  }
  /**
   * Method to retrieve Splits data from external Storage and transfer to local InMemory cache.
   *
   * @param {SplitsCacheInMemory} splitCacheInMemory  Reference to the local InMemoryCache.
   */
  async getDataFromStorage() {
    const _splitsList: [string, string][] = [];
    try {
      const splitsNames = await this._splitsStorage.getSplitNames();

      for (let i = 0; i < splitsNames.length; i++) {
        const name = splitsNames[i];
        const splitDefinition = await this._splitsStorage.getSplit(name);
        if (splitDefinition) _splitsList.push([name, splitDefinition]);
      }

      this._inMemoryStorage?.splits.addSplits(_splitsList);

      const registeredSegments = await this._segmentsStorage.getRegisteredSegments();
      if (registeredSegments.length > 0)
        this._inMemoryStorage.segments.registerSegments(registeredSegments);

      const changeNumber = await this._splitsStorage.getChangeNumber();

      this._inMemoryStorage?.splits.setChangeNumber(changeNumber);
    } catch (error) {
      this._settings.log.error(
        `Split InMemory Sinchronization: Error when retreving data from external Storage. Error: ${error}`
      );
    }
  }

  /**
   * Function to store Split data from InMemory cache to the provided external Storage.
   */
  async putDataToStorage() {
    try {
      const splitsNames = this._inMemoryStorage.splits.getSplitNames() || [];

      if (splitsNames.length > 0) {
        const splitsToStore: [string, string][] = [];
        for (let i = 0; i < splitsNames?.length; i++) {
          const name = splitsNames[i];
          // @ts-ignore
          const splitDefinition = this._inMemoryStorage.splits.getSplit(name);
          if (splitDefinition)
            splitsToStore.push([ name, splitDefinition ]);

          await this._splitsStorage.addSplits(splitsToStore);

          const changeNumber = this._inMemoryStorage?.splits.getChangeNumber();
          if (changeNumber)
            await this._splitsStorage.setChangeNumber(changeNumber);
        }
      }

      const registeredSegments = this._inMemoryStorage.segments.getRegisteredSegments();

      if (registeredSegments.length > 0)
        await this._segmentsStorage.registerSegments(registeredSegments);

    } catch (error) {
      this._settings.log.error(
        `Split InMemory Sinchronization: Error when storing data to external Storage. Error: ${error}`
      );
    }
  }

  /**
   * Function to use the InMemoryCache to execute the SplitUpdater to fetch and store the Splits
   * from the BE.
   *
   * @returns {Promise<boolean>}
   */
  async getSplitChangesInMemory(): Promise<boolean> {
    this._splitUpdater = splitChangesUpdaterFactory(
      this._settings.log,
      this._fetcher,
      this._inMemoryStorage.splits,
      this._inMemoryStorage.segments,
    );
    try {
      this._settings.log.info('InMemoryOperation config enabled.');
      await this.getDataFromStorage();
      const res = await this._splitUpdater();
      if (!res) {
        return Promise.resolve(false);
      }
      await this.putDataToStorage();
      return res;
    } catch (error) {
      this._settings.log.error(`Error executing Splits Synchronization with InMemory cache. ${error}`);
      return Promise.resolve(false);
    }
  }
}
