import { IFetchSegmentChanges } from '@splitsoftware/splitio-commons/src/services/types';
import segmentChangesFetcherFactory
  from '@splitsoftware/splitio-commons/src/sync/polling/fetchers/segmentChangesFetcher';
import { segmentChangesUpdaterFactory }
  from '@splitsoftware/splitio-commons/src/sync/polling/updaters/segmentChangesUpdater';
import { ISettingsInternal } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/types';
import { ISegmentsCacheAsync } from '@splitsoftware/splitio-commons/types/storages/types';

/**
 * Class that manages all the Segments entities related actions.
 */
export class SegmentsSynchronizer {
  /**
   * The local reference to the Synchronizer's Storage.
   */
  private _segmentsStorage;
  /**
   * The local reference to the Fetch implementation required to perform requests.
   */
  private _fetcher;
  /**
   * The local reference to the SegmentsUpdater from @splitio/javascript-commons.
   */
  // @ts-ignore
  private _segmentsUpdater;
  /**
   * The local reference to the Synchronizer's settings configurations.
   */
  private _settings;

  /**
   * @param {IFetchSegmentChanges}  segmentsFetcher  The SegmentChanges fetcher from SplitAPI.
   * @param {ISettings}             settings         The Synchronizer's settings.
   * @param {ISegmentsCacheAsync}   segmentsStorage  The reference to the current Storage.
   */
  constructor(
    segmentsFetcher: IFetchSegmentChanges,
    settings: ISettingsInternal,
    segmentsStorage: ISegmentsCacheAsync
  ) {
    this._segmentsStorage = segmentsStorage;
    this._settings = settings;
    this._fetcher = segmentChangesFetcherFactory(segmentsFetcher);
  }

  /**
   * Function to use the SplitUpdater, in order fetch and store the Splits from the BE.
   *
   * @returns {Promise<any>}
   */
  getSegmentsChanges(): Promise<any> {
    this._segmentsUpdater = segmentChangesUpdaterFactory(
      this._settings.log,
      this._fetcher,
      this._segmentsStorage,
    );
    return this._segmentsUpdater();
  }
}