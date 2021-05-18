import { IPostTestImpressionsBulk } from '@splitsoftware/splitio-commons/src/services/types';
import { IImpressionsCacheAsync } from '@splitsoftware/splitio-commons/src/storages/types';
import { ISettingsInternal } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/types';
import { impressionsSubmitterFactory } from '../submitters/synchroniserImpressionsSubmitter';

/**
 * Class that manages impressions synchronization.
 */
export class ImpressionsSynchroniser {
  /**
   * The local reference to the Synchroniser's settings configurations.
   */
  private _settings;
  /**
   * The local reference to the Synchroniser's Impressions' Storage.
   */
  private _impressionsStorage;
  /**
   * The local reference to the SplitAPI's Post request action.
   */
  private _postImpressionsBulk;
  /**
   * @param {ISettingsInternal}      settings             The Synchroniser's settings reference.
   * @param {IPostimpressionsBulk}   postImpressionsBulk  SplitApi's Post request function to Impressions endpoint.
   * @param {IImpressionsCacheAsync} impressionsStorage   The reference to the impresions' Storage.
   */
  constructor(
    settings: ISettingsInternal,
    postImpressionsBulk: IPostTestImpressionsBulk,
    impressionsStorage: IImpressionsCacheAsync
  ) {
    this._settings = settings;
    this._postImpressionsBulk  = postImpressionsBulk;
    this._impressionsStorage = impressionsStorage;
  }

  /**
   * Function to configure the ImpressionsSyncTask and the execute the Impressions POST request.
   *
   * @returns {Promise<any>}
   */
  synchroniseImpressions(): Promise<any> {
    // @todo: WIP
    const impressionsSubmitter = impressionsSubmitterFactory(this._postImpressionsBulk, this._impressionsStorage);
    return Promise.resolve(impressionsSubmitter);
  }
}
