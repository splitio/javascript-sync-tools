import { ISettingsInternal } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/types';
import { PluggableStorage } from '@splitsoftware/splitio-commons/src/storages/pluggable';
import { IStorageFactoryParams } from '@splitsoftware/splitio-commons/src/storages/types';

/**
 * Function to create an InMemory Storage instance.
 *
 * @param {ISettingsInternal} settings   The Synchronizer's settings.
 * @param {() => void}        onReadyCb  The callback to execute when instantiating the custom Storage.
 * @returns {IStorageAsync}
 */
export function SynchronizerStorageFactory(settings: ISettingsInternal, onReadyCb: IStorageFactoryParams['onReadyCb']) {
  const { log, storage } = settings;
  // @ts-ignore We don't need metadata.
  const storageFactorParams: IStorageFactoryParams = {
    log,
    optimize: false,
    // @ts-ignore
    onReadyCb,
  };

  // @ts-ignore
  const storageFactory = PluggableStorage(storage);
  // Ignoring metadata parameter since it's use by the Consumer API (like Events.track)
  // and the Synchronizer doesn't need to perform such actions.
  return storageFactory(storageFactorParams);
}