import { ISettings } from '@splitsoftware/splitio-commons/src/types';
import { PluggableStorage } from '@splitsoftware/splitio-commons/src/storages/pluggable';
import { IStorageFactoryParams } from '@splitsoftware/splitio-commons/src/storages/types';

// @TODO refactor into an storageValidator like in Browser and RN SDKs
/**
 * Function to create an InMemory Storage instance.
 *
 * @param settings - The Synchronizer's settings.
 * @param onReadyCb - The callback to execute when instantiating the pluggable storage.
 * @returns A pluggable storage instance.
 */
export function synchronizerStorageFactory(settings: ISettings, onReadyCb: IStorageFactoryParams['onReadyCb']) {
  const { storage } = settings;

  // @TODO support both storage param types?: config object (JS SDK) and storage function (Browser and RN SDK)
  // @ts-expect-error
  const storageFactory = typeof storage === 'function' ? storage : PluggableStorage(storage);
  // Ignoring metadata parameter since it's use by the Consumer API (like Events.track)
  // and the Synchronizer doesn't need to perform such actions.
  return storageFactory({ settings, onReadyCb });
}
