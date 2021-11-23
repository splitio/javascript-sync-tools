import { ISettings } from '@splitsoftware/splitio-commons/src/types';
import { PluggableStorage } from '@splitsoftware/splitio-commons/src/storages/pluggable';
import { IStorageFactoryParams } from '@splitsoftware/splitio-commons/src/storages/types';

// @TODO refactor into an storageValidator like in Browser and RN SDKs
/**
 * Function to create an InMemory Storage instance.
 *
 * @param {ISettings} settings   The Synchronizer's settings.
 * @param {() => void}        onReadyCb  The callback to execute when instantiating the pluggable storage.
 * @returns {IStorageAsync}
 */
export function SynchronizerStorageFactory(settings: ISettings, onReadyCb: IStorageFactoryParams['onReadyCb']) {
  const { log, storage } = settings;
  // @ts-ignore We don't need metadata.
  const storageFactorParams: IStorageFactoryParams = {
    log,
    optimize: false,
    onReadyCb,
  };

  // @TODO support both storage param types?: config object (JS SDK) and storage function (Browser and RN SDK)
  const storageFactory = typeof storage === 'function' ? storage : PluggableStorage(storage);
  // Ignoring metadata parameter since it's use by the Consumer API (like Events.track)
  // and the Synchronizer doesn't need to perform such actions.
  return storageFactory(storageFactorParams);
}
