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
 * Returning function with .
 *
 * @param {any} config  Object with the keys and values for instatiating a SettingsInternal object.
 * @returns {ISettingsInternal}
 */
export function synchronizerSettingsValidator(config: any) {
  const { eventsPerPost, maxRetries } = config.synchronizerConfigs;

  if (isNaNNumber(eventsPerPost) || maxRetries <= 0 ) {
    config.log.warn('EVENTS_PER_POST must be a positive integer number. Using default values');
  }

  if (isNaNNumber(maxRetries) || maxRetries <= 0 ) {
    config.log.warn('EVENTS_PER_POST must be a positive integer number. Using default values');
  }

  return settingsValidation(config, params);
}
