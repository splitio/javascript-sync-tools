import { IPostEventsBulk } from '@splitsoftware/splitio-commons/src/services/types';
import { IEventsCacheAsync } from '@splitsoftware/splitio-commons/src/storages/types';
import { eventsSubmitterFactory } from '../submitters/synchroniserEventsSubmitter';

/**
 * Class that manages Events synchronization.
 */
export class EventsSynchroniser {
  /**
   * The local reference to the Synchroniser's Events' Storage.
   */
  private _eventsStorage;
  /**
   * The local reference to the SplitAPI's Events POST request action.
   */
  private _postEventsBulk;
  /**
   * The local reference to the Event's submitter.
   */
  private _eventsSubmitter;
  /**
   *
   * @param {IPostEventsBulk}   postTestEventsBulk  SplitApi's Post request function to Events endpoint.
   * @param {IEventsCacheAsync} eventsStorage       The reference to the event's Storage.
   */
  constructor(
    postTestEventsBulk: IPostEventsBulk,
    eventsStorage: IEventsCacheAsync
  ) {
    this._postEventsBulk  = postTestEventsBulk;
    this._eventsStorage = eventsStorage;
    this._eventsSubmitter = eventsSubmitterFactory(this._postEventsBulk, this._eventsStorage);
  }

  /**
   * Function to execute the Events POST request. It can return a boolean if the operation went
   * good/wrong or a string with a message in case it catches an error. The return promise will
   * never be rejected.
   *
   * @returns {Promise<boolean|string>}
   */
  synchroniseEvents(): Promise<boolean> {
    return this._eventsSubmitter();
  }
}
