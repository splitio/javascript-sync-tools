import { ISettings } from '@splitsoftware/splitio-commons/src/types';
import { PluggableStorage } from '@splitsoftware/splitio-commons/src/storages/pluggable';
import { IStorageFactoryParams } from '@splitsoftware/splitio-commons/src/storages/types';
import { UNKNOWN } from '@splitsoftware/splitio-commons/src/utils/constants';

// @TODO refactor into an storageValidator like in Browser and RN SDKs
/**
 * Function to create an InMemory Storage instance.
 *
 * @param {ISettings} settings   The Synchronizer's settings.
 * @param {() => void}        onReadyCb  The callback to execute when instantiating the pluggable storage.
 * @returns {IStorageAsync}
 */
export function synchronizerStorageFactory(settings: ISettings, onReadyCb: IStorageFactoryParams['onReadyCb']) {
  const { log, storage, version } = settings;
  // @ts-ignore We don't need mode.
  const storageFactorParams: IStorageFactoryParams = {
    log,
    optimize: false,
    onReadyCb,
    metadata: { s: version, i: UNKNOWN, n: UNKNOWN },
  };

  // @TODO support both storage param types?: config object (JS SDK) and storage function (Browser and RN SDK)
  const storageFactory = typeof storage === 'function' ? storage : PluggableStorage(storage);
  // Ignoring metadata parameter since it's use by the Consumer API (like Events.track)
  // and the Synchronizer doesn't need to perform such actions.
  return storageFactory(storageFactorParams);
}
