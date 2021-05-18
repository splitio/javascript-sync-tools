import { ISettingsInternal } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/types';
import { metadataBuilder } from '@splitsoftware/splitio-commons/src/storages/metadataBuilder';
import { PluggableStorage } from '@splitsoftware/splitio-commons/src/storages/pluggable';

/**
 * Function to create an InMemory Storage instance.
 *
 * @param {ISettingsInternal} settings  The Synchroniser's settings.
 * @returns {IStorageAsync}
 */
export function SynchroniserStorageFactory(settings: ISettingsInternal) {
  const { log, storage } = settings;
  const metadata = metadataBuilder(settings);
  const storageFactorParams = {
    log,
    optimize: false,
    metadata,
  };

  // @ts-ignore
  const storageFactory = PluggableStorage(storage);
  return storageFactory(storageFactorParams);
}
