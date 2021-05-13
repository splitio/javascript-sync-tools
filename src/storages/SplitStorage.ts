import { InMemoryStorageFactory } from '@splitsoftware/splitio-commons/src/storages/inMemory/InMemoryStorage';
import { ISettingsInternal } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/types';
import { metadataBuilder } from '@splitsoftware/splitio-commons/src/storages/metadataBuilder';

/**
 * Function to create an InMemory Storage instance.
 *
 * @param {ISettingsInternal} settings  The Synchroniser's settings.
 * @returns {IStorageSync}
 */
export function SynchroniserStorageFactory(settings: ISettingsInternal) {
  const { log } = settings;
  const metadata = metadataBuilder(settings);

  const storageFactorParams = {
    log,
    optimize: false,
    metadata,
  };

  return InMemoryStorageFactory(storageFactorParams);
}
