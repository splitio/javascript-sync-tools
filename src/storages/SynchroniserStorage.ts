import { ISettingsInternal } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/types';
import { PluggableStorage } from '@splitsoftware/splitio-commons/src/storages/pluggable';

/**
 * Function to create an InMemory Storage instance.
 *
 * @param {ISettingsInternal} settings  The Synchroniser's settings.
 * @returns {IStorageAsync}
 */
export function SynchroniserStorageFactory(settings: ISettingsInternal) {
  const { log, storage } = settings;
  const storageFactorParams = {
    log,
    optimize: false,
  };

  // @ts-ignore
  const storageFactory = PluggableStorage(storage);
  // @ts-ignore
  // Ignoring metadata parameter since it's use by the Consumer API (like Events.track)
  // and the Synchroniser doesn't need to perform such actions.
  return storageFactory(storageFactorParams);
}
