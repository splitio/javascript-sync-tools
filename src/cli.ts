/* eslint-disable no-process-env */
import { exit } from 'process';
import { synchroniserSettingsValidator } from './settings';
import { SynchroniserManager } from './manager';
import { validateApiKey } from '@splitsoftware/splitio-commons/src/utils/inputValidation';

console.log('# Synchroniser: Initialization');
/**
 * The API Url to be set for this example.
 */
const apiUrl = process.env.API_URL;
/**
 * The API key value.
 */
const apikey = process.env.APIKEY;

if (!apiUrl) {
  console.log('Invalid API URL configuration.');
  exit(0);
}
/**
 * Settings creation.
 *
 * TODO: These settings could be defined in a JSON file or by parameters input
 *       when the CLI is executed.
 */
const settings = synchroniserSettingsValidator({
  core: {
    authorizationKey: apikey,
  },
  urls: {
    // CDN having all the information for your environment
    sdk: apiUrl,
    // Storage for your SDK events
    // events: 'https://events.split.io/api',
  },
});

if (!validateApiKey(settings.log, apikey)) {
  console.log('Missing APIKEY configuration.');
  exit(0);
}

const manager = new SynchroniserManager(settings);

manager.execute();
