import { ILogger } from '@splitsoftware/splitio-commons/src/logger/types';
import { IPostTestImpressionsCount } from '@splitsoftware/splitio-commons/src/services/types';
import ImpressionCountsCacheInMemory
  from '@splitsoftware/splitio-commons/src/storages/inMemory/ImpressionCountsCacheInMemory';
import { impressionsCountSubmitterFactory } from '../submitters/synchronizerImpressionsCountSubmitter';

/**
 * Class to manage the Impressions Count synchronization.
 */
export class ImpressionsCountSynchronizer {
  private _impressionsCountSubmitter;
  private _postImpressionsCount;
  /**
   *
   * @param {IPostTestImpressionsCount}     postImpressionsCount  SplitAPI's POST request.
   * @param {ImpressionCountsCacheInMemory} countsCache           The reference to the Impression's Count Storage.
   * @param {ILogger}                       logger                The reference to the Synchronizer's Logger.
   */
  constructor(
    postImpressionsCount: IPostTestImpressionsCount,
    countsCache: ImpressionCountsCacheInMemory,
    logger: ILogger
  ) {
    this._postImpressionsCount = postImpressionsCount;
    this._impressionsCountSubmitter = impressionsCountSubmitterFactory(
      this._postImpressionsCount,
      countsCache,
      logger
    );
  }

  /**
   * Function to configure and execute the Impressions Count Post request.
   *
   * @returns {Promise<boolean>}
   */
  synchroniseImpressionsCount(): Promise<boolean> {
    return this._impressionsCountSubmitter();
  }
}
