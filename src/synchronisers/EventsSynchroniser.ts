import { IPostEventsBulk } from '@splitsoftware/splitio-commons/src/services/types';
import { IEventsCacheSync } from '@splitsoftware/splitio-commons/src/storages/types';
import { eventsSyncTaskFactory } from '@splitsoftware/splitio-commons/src/sync/submitters/eventsSyncTask';
import { ISettingsInternal } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/types';

/**
 * Class that manages Events synchronization.
 */
export class EventsSynchroniser {
  /**
   * The local reference to the Synchroniser's settings configurations.
   */
  private _settings;
  private _eventsStorage;
  private _postEventsBulk;
  /**
   *
   * @param {ISettingsInternal} settings            The Synchroniser's settings reference.
   * @param {IPostEventsBulk}   postTestEventsBulk  SplitApi's Post request function to Events endpoint.
   * @param {IEventsCacheSync}  eventsStorage       The reference to the event's Storage.
   */
  constructor(
    settings: ISettingsInternal,
    postTestEventsBulk: IPostEventsBulk,
    eventsStorage: IEventsCacheSync
  ) {
    this._settings = settings;
    this._postEventsBulk  = postTestEventsBulk;
    this._eventsStorage = eventsStorage;
  }

  /**
   * Function to do stuff.
   *
   * @returns {Promise<any>}
   */
  synchroniseEvents(): Promise<any> {
    const eventsSubmitter = eventsSyncTaskFactory(
      this._settings.log,
      this._postEventsBulk,
      this._eventsStorage,
      this._settings.scheduler.eventsPushRate,
      this._settings.startup.eventsFirstPushWindow
    );
    return eventsSubmitter.execute();
  }
}
