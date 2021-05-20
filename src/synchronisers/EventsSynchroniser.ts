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
  }

  /**
   * Function to configure the EventsSyncTask and the execute the Events POST request.
   *
   * @returns {Promise<any>}
   */
  synchroniseEvents(): Promise<any> {
    const eventsSubmitter = eventsSubmitterFactory(this._postEventsBulk, this._eventsStorage);

    return eventsSubmitter();
  }
}
