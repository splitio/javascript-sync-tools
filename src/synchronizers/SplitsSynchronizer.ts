import { IFetchSplitChanges } from '@splitsoftware/splitio-commons/src/services/types';
import { InMemoryStorageFactory } from '@splitsoftware/splitio-commons/src/storages/inMemory/InMemoryStorage';
import { splitChangesFetcherFactory } from '@splitsoftware/splitio-commons/src/sync/polling/fetchers/splitChangesFetcher';
import { splitChangesUpdaterFactory } from '@splitsoftware/splitio-commons/src/sync/polling/updaters/splitChangesUpdater';
import { ISettings } from '@splitsoftware/splitio-commons/src/types';
import { ISplit } from '@splitsoftware/splitio-commons/src/dtos/types';
import { IStorageAsync, IStorageSync } from '@splitsoftware/splitio-commons/src/storages/types';

type ISplitChangesUpdater = (noCache?: boolean) => Promise<boolean>;

/**
 * Class that manages the synchronization of feature flags.
 */
export class SplitsSynchronizer {
  /**
   * The local reference to the Synchronizer's Storage.
   */
  private _storage;
  /**
   * The local reference to the Fetch implementation required to perform requests.
   */
  private _fetcher;
  /**
   * The local reference to the SplitUpdater from `@splitio/javascript-commons`.
   */
  private _splitUpdater?: ISplitChangesUpdater;
  /**
   * The local reference to the Synchronizer's settings configurations.
   */
  private _settings;
  /*
   * @todo: Implement Event Emitter param from splitUpdater and segmentsUpdater to calculate the
   *        differences between both storage.
   */
  /**
   * The local reference to the InMemory cache used when InMemoryOperation mode is enabled.
   */
  _inMemoryStorage: IStorageSync;
  /**
   * The local reference to the InMemory cache initial Snapshot used when InMemoryOperation mode is enabled to detect
   * differences between the current Storage's data with the InMemory updated data post synchronization.
   */
  _inMemoryStorageSnapshot: IStorageSync;

  /**
   * @param splitFetcher - The SplitChanges fetcher from Split API.
   * @param settings - The Synchronizer's settings.
   * @param storage - The reference to the current Storage.
   */
  constructor(
    splitFetcher: IFetchSplitChanges,
    settings: ISettings,
    storage: IStorageAsync,
  ) {
    this._storage = storage;
    this._settings = settings;
    this._fetcher = splitChangesFetcherFactory(splitFetcher);
    this._splitUpdater = undefined; // @ts-ignore
    this._inMemoryStorage = InMemoryStorageFactory({ settings }); // @ts-ignore
    this._inMemoryStorageSnapshot = InMemoryStorageFactory({ settings });
  }

  /**
   * Function to use the SplitUpdater, in order to fetch and store feature flags from the BE.
   *
   * @returns A promise that resolves to a boolean indicating the success of the operation.
   */
  getSplitChanges(): Promise<boolean> {
    this._splitUpdater = splitChangesUpdaterFactory(
      this._settings.log,
      this._fetcher,
      this._storage,
      this._settings.sync.__splitFiltersValidation,
    );
    return this._splitUpdater();
  }
  /**
   * Method to retrieve feature flags from external Storage and transfer to local InMemory cache.
   *
   * @param splitCacheInMemory - Reference to the local InMemoryCache.
   */
  async getDataFromStorage() {
    try {
      const splits = await this._storage.splits.getAll();

      const changeNumber = await this._storage.splits.getChangeNumber();
      this._inMemoryStorage.splits.update(splits, [], changeNumber);

      this._inMemoryStorageSnapshot.splits.update(splits, [], changeNumber);

      const registeredSegments = await this._storage.segments.getRegisteredSegments();
      if (registeredSegments.length > 0) {
        this._inMemoryStorage.segments.registerSegments(registeredSegments);
        this._inMemoryStorageSnapshot.segments.registerSegments(registeredSegments);
      }
    } catch (error) {
      this._settings.log.error(
        `Feature flags InMemory synchronization: Error when retrieving data from external Storage. Error: ${error}`
      );
    }
  }

  /**
   * Function to store feature flags from InMemory cache to the provided external Storage.
   */
  async putDataToStorage() {
    try {
      const snapshotChangeNumber = this._inMemoryStorageSnapshot?.splits.getChangeNumber();
      const changeNumber = this._inMemoryStorage?.splits.getChangeNumber();

      if (snapshotChangeNumber === changeNumber) return;

      const diffResult = await this.processDifferences();

      if (diffResult > 0) this._settings.log.info(`Removed ${diffResult} feature flags from storage`);
      const splits = this._inMemoryStorage.splits.getAll() || [];

      if (splits.length > 0) {

        const splitsToStore: ISplit[] = [];
        for (let i = 0; i < splits.length; i++) {
          const split = splits[i];
          const { name, changeNumber } = split;
          const oldSplitDefinition = this._inMemoryStorageSnapshot.splits.getSplit(name);

          if (split) {
            // If the feature flag doesn't exists.
            if (!oldSplitDefinition) {
              splitsToStore.push(split);
              continue;
            }
            // If the feature flag exists and needs to be updated.
            if (oldSplitDefinition.changeNumber !== changeNumber) {
              splitsToStore.push(split);
              continue;
            }
          }
        }

        await this._storage.splits.update(splitsToStore, [], changeNumber);
      }

      const registeredSegments = this._inMemoryStorage.segments.getRegisteredSegments();

      // @todo: Update segment definitions and change number
      if (registeredSegments.length > 0)
        await this._storage.segments.registerSegments(registeredSegments);
    } catch (error) {
      this._settings.log.error(
        `Feature flags InMemory synchronization: Error when storing data to external Storage. Error: ${error}`
      );
    }
  }

  /**
   * Function to use the InMemoryCache to execute the SplitUpdater to fetch and store feature flags
   * from the BE.
   *
   * @returns A promise that resolves to a boolean indicating the success of the operation.
   */
  async getSplitChangesInMemory(): Promise<boolean> {
    this._splitUpdater = splitChangesUpdaterFactory(
      this._settings.log,
      this._fetcher,
      this._inMemoryStorage,
      this._settings.sync.__splitFiltersValidation,
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
      this._settings.log.error(`Error executing feature flags synchronization with InMemory cache. ${error}`);
      return Promise.resolve(false);
    }
  }
  /**
   * Function to compare an initial InMemory cache snapshot with the updated InMemory cache after synchronization.
   * It will calculate differences, removing feature flags that are no longer required and updating the ones with new data.
   *
   * @returns A promise that resolves to a number indicating the number of feature flags removed.
   */
  async processDifferences() {
    let deletedAmount = 0;
    const oldSplitsKeys = this._inMemoryStorageSnapshot.splits.getSplitNames() || [];
    const newSplitsKeys = this._inMemoryStorage.splits.getSplitNames() || [];
    const splitKeysToRemove: string[] = [];

    oldSplitsKeys.forEach((key) => {
      const splitName = key;

      if (!newSplitsKeys.some((k) => k === splitName)) {
        splitKeysToRemove.push(splitName);
        deletedAmount++;
      }
    });

    // @ts-expect-error
    await this._storage.splits.update([], splitKeysToRemove.map((k) => ({ name: k })), this._storage.splits.getChangeNumber());

    return deletedAmount;
  }
}
