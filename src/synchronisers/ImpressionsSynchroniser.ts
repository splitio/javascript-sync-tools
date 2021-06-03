import { IPostTestImpressionsBulk } from '@splitsoftware/splitio-commons/src/services/types';
import ImpressionCountsCacheInMemory from
  '@splitsoftware/splitio-commons/src/storages/inMemory/ImpressionCountsCacheInMemory';
import { IImpressionsCacheAsync } from '@splitsoftware/splitio-commons/src/storages/types';
import ImpressionObserver from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/ImpressionObserver';
import { impressionsSubmitterFactory } from '../submitters/synchroniserImpressionsSubmitter';

/**
 * Class that manages impressions synchronization.
 */
export class ImpressionsSynchroniser {
  /**
   * The local reference to the Synchroniser's Impressions' Storage.
   */
  private _impressionsStorage;
  /**
   * The local reference to the SplitAPI's Post request action.
   */
  private _postImpressionsBulk;
  /**
   * The local reference to the Impression's Submitter.
   */
  private _impressionsSubmitter;
  /**
   * @param {IPostimpressionsBulk}          postImpressionsBulk  SplitApi's Post request function to Impressions
   *                                                             endpoint.
   * @param {IImpressionsCacheAsync}        impressionsStorage   The reference to the impresions' Storage.
   * @param {ImpressionObserver}            observer             The reference to the impresions' Storage.
   * @param {ImpressionCountsCacheInMemory} countsCache          The reference to the impresions' Storage.
   */
  constructor(
    postImpressionsBulk: IPostTestImpressionsBulk,
    impressionsStorage: IImpressionsCacheAsync,
    observer: ImpressionObserver,
    countsCache?: ImpressionCountsCacheInMemory,
  ) {
    this._postImpressionsBulk  = postImpressionsBulk;
    this._impressionsStorage = impressionsStorage;
    this._impressionsSubmitter = impressionsSubmitterFactory(
      this._postImpressionsBulk,
      this._impressionsStorage,
      observer,
      countsCache,
    );
  }

  /**
   * Function to configure the ImpressionsSyncTask and the execute the Impressions POST request.
   *
   * @returns {Promise<any>}
   */
  synchroniseImpressions(): Promise<any> {
    return this._impressionsSubmitter();
  }
}
