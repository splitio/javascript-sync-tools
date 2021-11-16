import { ISettings } from '@splitsoftware/splitio-commons/src/types';
import { isNaNNumber } from '@splitsoftware/splitio-commons/src/utils/lang';
import { settingsValidation } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/index';
import { validateLogger } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/logger/builtinLogger';
import { SynchronizerConfigs } from '../types';
import { defaults } from './defaults';

// @TODO refactor settingsValidator as in JS SDKs

/**
 * Object with some default values to instantiate the application and fullfil internal
 * requirements.
 */
const params = {
  logger: validateLogger,
  defaults,
};

/**
 * Function to validate SDK settings and Synchronizer configs.
 *
 * @param {any} config  Object with the keys and values for instatiating a SettingsInternal object.
 * @returns {ISettings}
 */
export default function synchronizerSettingsValidator(
  config: ISettings &
  { synchronizerConfigs: SynchronizerConfigs }
): ISettings & { synchronizerConfigs: SynchronizerConfigs } {
  const synchronizerDefaults = {
    synchronizerMode: 'MODE_RUN_ALL',
    eventsPerPost: 1000,
    impressionsPerPost: 1000,
    maxRetries: 3,
    inMemoryOperation: false,
  };

  if (config.synchronizerConfigs) {
    let {
      eventsPerPost = undefined,
      impressionsPerPost = undefined,
      maxRetries = undefined,
    } = config.synchronizerConfigs;

    /**
     * TODO: validate if we need to set a something like MINIMUM_EVENTS/IMPRESSIONS_PER_POST.
     */
    if (eventsPerPost && (isNaNNumber(eventsPerPost) || eventsPerPost <= 0)) {
      console.log('EVENTS_PER_POST parameter must be a positive integer number. Using default value instead.');
    }

    if (impressionsPerPost && (isNaNNumber(impressionsPerPost) || impressionsPerPost <= 0)) {
      console.log('IMPRESSIONS_PER_POST parameter must be a positive integer number. Using default value instead.');
    }

    if (maxRetries && (isNaNNumber(maxRetries) || maxRetries <= 0)) {
      console.log('MAX_RETRIES parameter must be a positive integer number. Using default values instead.');
    }
  } else {
    Object.assign(config, { synchronizerConfigs: synchronizerDefaults });
  }

  return settingsValidation(config, params) as ISettings & { synchronizerConfigs: SynchronizerConfigs };
}
