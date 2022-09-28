import { ISettings } from '@splitsoftware/splitio-commons/src/types';
import { isIntegerNumber } from '@splitsoftware/splitio-commons/src/utils/lang';
import { settingsValidation } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/index';
import { validateLogger } from '@splitsoftware/splitio-commons/src/utils/settingsValidation/logger/builtinLogger';
import { ISynchronizerSettings } from '../../types';
import { defaults } from './defaults';

/**
 * Object with some default values to instantiate the application and fullfil internal
 * requirements.
 */
const params = {
  logger: validateLogger,
  defaults,
  consent: () => undefined,
  runtime: () => { return { ip: false, hostname: false }; },
};

function validatePositiveInteger(paramName: string, actualValue: any, defaultValue: number) {
  if (isIntegerNumber(actualValue) && actualValue > 0) return actualValue;

  console.log(`'${paramName}' parameter must be a positive integer number. Using default value (${defaultValue}) instead.`);
  return defaultValue;
}

/**
 * Function to validate Synchronizer config.
 *
 * @param {any} config  Synchronizer config object provided by the user.
 * @returns {ISettings}
 */
export function synchronizerSettingsValidator(
  config: ISynchronizerSettings
): ISettings & ISynchronizerSettings {

  // @ts-ignore
  const settings = settingsValidation(config, params) as ISettings & ISynchronizerSettings;
  // @ts-ignore, override readonly prop
  settings.mode = undefined; // "producer" mode

  const { scheduler } = settings;

  // @TODO validate synchronizerMode eventually
  // @TODO: validate minimum and maximum value for config params.
  scheduler.eventsPerPost = validatePositiveInteger('eventsPerPost', scheduler.eventsPerPost, defaults.scheduler.eventsPerPost);
  scheduler.impressionsPerPost = validatePositiveInteger('impressionsPerPost', scheduler.impressionsPerPost, defaults.scheduler.impressionsPerPost);
  scheduler.maxRetries = validatePositiveInteger('maxRetries', scheduler.maxRetries, defaults.scheduler.maxRetries);

  return settings;
}
