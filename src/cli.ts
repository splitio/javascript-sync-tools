import fs from 'fs';
import { exit, env, argv } from 'process';
import { synchroniserSettingsValidator } from './settings';
import { SynchroniserManager } from './manager';
import { validateApiKey } from '@splitsoftware/splitio-commons/src/utils/inputValidation';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import dotenv from 'dotenv';
import { ICustomStorageWrapper } from '@splitsoftware/splitio-commons/src/storages/types';

dotenv.config();

console.log('# Synchroniser: Initialization');

/**
 * The API Url .
 */
let _apiUrl: string | undefined;
/**
 * The Events API Url.
 */
let _eventsApiUrl: string | undefined;
/**
 * The API key value.
 */
let _apikey: string | undefined;
let customStorage: ICustomStorageWrapper;

const yargv = yargs(hideBin(argv))
  .usage('Usage: $0 [options]')
  .command('sync', 'Start synchronising tasks.')
  .example('$0 -m json --config path2/file.json -s path2/storage.js', '| Set settings from JSON file. -d')
  .example('$0 -m env -s path2/storage.js', '| Set settings from .env file.')
  .example(
    '$0 -k {A_VALID_APIKEY} -s path2/storage.js -r https://events.split.io/api/',
    '| Set APIKEY and Split API URL from param.'
  )
  .example('$0 -m env [...] -d', '| Set Debug Logging enabled')
  .example('$0 -m env [...] -i', '| Set Impressions Mode Debug mode')
  .alias('s', 'storage')
  .nargs('s', 1)
  .alias('m', 'mode')
  .nargs('m', 1)
  .alias('d', 'debug')
  .nargs('d', 0)
  .alias('k', 'apikey')
  .nargs('k', 1)
  .alias('r', 'apiUrl')
  .nargs('r', 1)
  .alias('e', 'eventsApiUrl')
  .nargs('e', 1)
  .alias('i', 'impressionsDebug')
  .config('json-file', function (configPath) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  })
  .describe('m', 'Set config mode: json | env')
  .describe('s', 'Path to the JS file exposing the Storage API')
  .describe('d', 'Set debug Logger enable')
  .describe('k', 'Set the apikey')
  .describe('r', 'Set the Split API URL')
  .describe('e', 'Set the Split Events API URL')
  .describe('i', 'Set the Impressions Mode debug enabled')
  .demandOption(['s'])
  .help('h')
  .alias('h', 'help')
  .epilog('copyright 2021')
  .argv;

const {
  mode,
  storage,
  APIKEY,
  apikey,
  apiUrl,
  API_URL,
  eventsApiUrl,
  EVENTS_API_URL,
  debug,
  impressionsDebug,
} = yargv;

console.log(` > Synchroniser's configs from: ${mode || 'CLI params'}`);

switch (mode) {
  case 'json':
    _apikey = APIKEY as string;
    _apiUrl = API_URL as string;
    _eventsApiUrl = EVENTS_API_URL as string;
    break;
  case 'env':
    _apikey = env.APIKEY;
    _apiUrl = env.API_URL;
    _eventsApiUrl = env.EVENTS_API_URL;
    break;
  default:
    _apikey = apikey as string;
    _apiUrl = apiUrl as string;
    _eventsApiUrl = eventsApiUrl as string;
    break;
}

try {
  customStorage = require(storage as string).default;
} catch (error) {
  // @ts-ignore
  console.log('Error importing Storage', error.message);
  exit(0);
}

if (!_apikey) {
  console.log('Unable to initialize Synchroniser task: missing APIKEY.');
  exit(0);
}

/**
 * Settings creation.
 */
const settings = synchroniserSettingsValidator({
  core: {
    authorizationKey: _apikey,
  },
  urls: {
    // CDN having all the information for your environment
    sdk: _apiUrl,
    // Storage for your SDK events
    events: _eventsApiUrl,
  },
  storage: {
    type: 'CUSTOM',
    prefix: 'InMemoryWrapper',
    // @ts-ignore
    wrapper: customStorage,
  },
  sync: {
    impressionsMode: impressionsDebug ? 'DEBUG' : 'OPTIMIZED',
  },
  debug: debug || false,
});

if (!validateApiKey(settings.log, _apikey)) {
  console.log('Unable to initialize Synchroniser task: invalid APIKEY.');
  exit(0);
}

const manager = new SynchroniserManager(settings);

manager.execute().then((res) => {
  if (!res) console.log('# Synchroniser execution failed.');
});
