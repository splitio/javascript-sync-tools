import { isNaNNumber } from '@splitsoftware/splitio-commons/src/utils/lang';
import { settingsValidation } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/index';
import { validateLogger } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/logger/builtinLogger';
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
  defaults: Object.assign(defaults, { version: `synchronizer-${version}` }),
};

/**
 * Function to validate SDK settings and Synchronizer configs.
 *
 * @param {any} config  Object with the keys and values for instatiating a SettingsInternal object.
 * @returns {ISettingsInternal}
 */
export function synchronizerSettingsValidator(config: any) {
  let { eventsPerPost, maxRetries } = config.synchronizerConfigs;

  if (eventsPerPost && isNaNNumber(eventsPerPost) || eventsPerPost <= 0 ) {
    console.log('EVENTS_PER_POST parameter must be a positive integer number. Using default value instead.');
    config.synchronizerConfigs.eventsPerPost = undefined;
  }

  if (maxRetries && (isNaNNumber(maxRetries) || maxRetries <= 0) ) {
    console.log('MAX_RETRIES parameter must be a positive integer number. Using default values instead.');
    config.synchronizerConfigs.maxRetries = undefined;
  }

  return settingsValidation(config, params);
}
