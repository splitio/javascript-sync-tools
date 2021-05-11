import { IFetchSegmentChanges } from '@splitsoftware/splitio-commons/src/services/types';
import segmentChangesFetcherFactory
  from '@splitsoftware/splitio-commons/src/sync/polling/fetchers/segmentChangesFetcher';
import { segmentChangesUpdaterFactory }
  from '@splitsoftware/splitio-commons/src/sync/polling/updaters/segmentChangesUpdater';
import { ISettingsInternal } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/types';
import { ISegmentsCacheSync } from '@splitsoftware/splitio-commons/types/storages/types';

/**
 * Class that manages all the Segments entities related actions.
 */
export class SegmentsSynchroniser {
  /**
   * The local reference to the Synchroniser's Storage.
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
   * The local reference to the Synchroniser's settings configurations.
   */
  private _settings;

  /**
   * @param {IFetchSegmentChanges} segmentsFetcher  The SegmentChanges fetcher from SplitAPI.
   * @param {ISettings}            settings         The Synchroniser's settings.
   * @param {ISegmentsCacheSync} segmentsStorage  The reference to the current Storage.
   */
  constructor(segmentsFetcher: IFetchSegmentChanges, settings: ISettingsInternal, segmentsStorage: ISegmentsCacheSync) {
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
