import { ISettings } from '@splitsoftware/splitio-commons/src/types';
import { isNaNNumber } from '@splitsoftware/splitio-commons/src/utils/lang';
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
  runtime: () => {return { ip: false, hostname: false };},
};

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

  const { eventsPerPost, impressionsPerPost, maxRetries } = settings.scheduler;

  // @TODO validate synchronizerMode eventually

  // @TODO: validate minimum and maximum value for config params.
  if (eventsPerPost && (isNaNNumber(eventsPerPost) || eventsPerPost <= 0)) {
    console.log('`eventsPerPost` parameter must be a positive integer number. Using default value instead.');
  }

  if (impressionsPerPost && (isNaNNumber(impressionsPerPost) || impressionsPerPost <= 0)) {
    console.log('`impressionsPerPost` parameter must be a positive integer number. Using default value instead.');
  }

  if (maxRetries && (isNaNNumber(maxRetries) || maxRetries <= 0)) {
    console.log('`maxRetries` parameter must be a positive integer number. Using default values instead.');
  }

  return settings;
}
