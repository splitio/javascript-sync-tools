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
  defaults: Object.assign(defaults, { version: `synchroniser-${version}` }),
};

/**
 * Returning function with .
 *
 * @param {any} config  Object with the keys and values for instatiating a SettingsInternal object.
 * @returns {ISettingsInternal}
 */
export function synchroniserSettingsValidator(config: any) {
  return settingsValidation(config, params);
}
