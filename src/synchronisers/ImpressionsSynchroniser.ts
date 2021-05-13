import { IPostTestImpressionsBulk } from '@splitsoftware/splitio-commons/src/services/types';
import { IImpressionsCacheSync } from '@splitsoftware/splitio-commons/src/storages/types';
import { impressionsSyncTaskFactory } from '@splitsoftware/splitio-commons/src/sync/submitters/impressionsSyncTask';
import { ISettingsInternal } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/types';

/**
 * Class that manages impressions synchronization.
 */
export class ImpressionsSynchroniser {
  /**
   * The local reference to the Synchroniser's settings configurations.
   */
  private _settings;
  private _impressionsStorage;
  private _postImpressionsBulk;
  /**
   * @param {ISettingsInternal}     settings             The Synchroniser's settings reference.
   * @param {IPostimpressionsBulk}  postImpressionsBulk  SplitApi's Post request function to Impressions endpoint.
   * @param {IImpressionsCacheSync} impressionsStorage   The reference to the impresions' Storage.
   */
  constructor(
    settings: ISettingsInternal,
    postImpressionsBulk: IPostTestImpressionsBulk,
    impressionsStorage: IImpressionsCacheSync
  ) {
    this._settings = settings;
    this._postImpressionsBulk  = postImpressionsBulk;
    this._impressionsStorage = impressionsStorage;
  }

  /**
   * Function to do stuff.
   *
   * @returns {Promise<any>}
   */
  synchroniseImpressions(): Promise<any> {
    const impressionsSubmitter = impressionsSyncTaskFactory(
      this._settings.log,
      this._postImpressionsBulk,
      this._impressionsStorage,
      this._settings.scheduler.impressionsRefreshRate,
      this._settings.core.labelsEnabled
    );

    return impressionsSubmitter.execute();
  }
}
