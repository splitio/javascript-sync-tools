import { ISettings } from '@splitsoftware/splitio-commons/src/types';
import { isNaNNumber } from '@splitsoftware/splitio-commons/src/utils/lang';
import { settingsValidation } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/index';
import { validateLogger } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/logger/builtinLogger';
import { ISettingsInternal } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/types';
import { SynchronizerConfigs } from '../types';
import { defaults } from './defaults';

/**
 * Reference to the package version that is going to be overwritten when building the app
 * for the corresponding value.
 */
const version = '@VERSION@';
/**
 * Object with some default values to instantiate the application and fullfil internal
 * requirements.
 */
const params = {
  logger: validateLogger,
  defaults: Object.assign(defaults, { version: `synchronizer-${version}`, streamingEnabled: false }),
};

/**
 * Function to validate SDK settings and Synchronizer configs.
 *
 * @param {any} config  Object with the keys and values for instatiating a SettingsInternal object.
 * @returns {ISettingsInternal}
 */
export default function synchronizerSettingsValidator(
  config: ISettings &
  { synchronizerConfigs: SynchronizerConfigs }
): ISettingsInternal & { synchronizerConfigs: SynchronizerConfigs } {
  const synchronizerDefaults = {
    synchronizerMode: 'MODE_RUN_ALL',
    eventsPerPost: 1000,
    impressionsPerPost: 1000,
    maxRetries: 3,
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
    Object.assign(config, { ...config }, { synchronizerConfigs: synchronizerDefaults });
  }

  return settingsValidation(config, params) as ISettingsInternal & { synchronizerConfigs: SynchronizerConfigs };
}
