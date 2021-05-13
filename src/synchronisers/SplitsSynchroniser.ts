import { IFetchSplitChanges } from '@splitsoftware/splitio-commons/src/services/types';
import splitChangesFetcherFactory from '@splitsoftware/splitio-commons/src/sync/polling/fetchers/splitChangesFetcher';
// eslint-disable-next-line max-len
import { splitChangesUpdaterFactory } from '@splitsoftware/splitio-commons/src/sync/polling/updaters/splitChangesUpdater';
import { ISettingsInternal } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/types';
import { ISegmentsCacheSync, ISplitsCacheSync } from '@splitsoftware/splitio-commons/types/storages/types';

/**
 * Class that manages all the Splits entities related actions.
 */
export class SplitsSynchroniser {
  /**
   * The local reference to the Synchroniser's Split Storage.
   */
  private _segmentsStorage;
  /**
   * The local reference to the Synchroniser's Segments Storage.
   */
  private _splitsStorage;
  /**
   * The local reference to the Fetch implementation required to perform requests.
   */
  private _fetcher;
  /**
   * The local reference to the SplitUpdater from @splitio/javascript-commons.
   */
  // @ts-ignore
  private _splitUpdater;
  /**
   * The local reference to the Synchroniser's settings configurations.
   */
  private _settings;

  /**
   * @param {IFetchSplitChanges} splitFetcher     The SplitChanges fetcher from SplitAPI.
   * @param {ISettings}          settings         The Synchroniser's settings.
   * @param {ISplitsCacheSync}   splitsStorage    The reference to the current Storage.
   * @param {ISegmentsCacheSync} segmentsStorage  The reference to the current Storage.
   */
  constructor(
    splitFetcher: IFetchSplitChanges,
    settings: ISettingsInternal,
    splitsStorage: ISplitsCacheSync,
    segmentsStorage: ISegmentsCacheSync
  ) {
    this._splitsStorage = splitsStorage;
    this._segmentsStorage = segmentsStorage;
    this._settings = settings;
    this._fetcher = splitChangesFetcherFactory(splitFetcher);
  }

  /**
   * Function to use the SplitUpdater, in order fetch and store the Splits from the BE.
   *
   * @returns {Promise<any>}
   */
  getSplitChanges(): Promise<any> {
    this._splitUpdater = splitChangesUpdaterFactory(
      this._settings.log,
      this._fetcher,
      this._splitsStorage,
      this._segmentsStorage
    );
    return this._splitUpdater();
  }
}