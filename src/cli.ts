import fs from 'fs';
import { exit, env, argv } from 'process';
import { synchronizerSettingsValidator } from './settings';
import { SynchronizerManager } from './manager';
import { validateApiKey } from '@splitsoftware/splitio-commons/src/utils/inputValidation';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import dotenv from 'dotenv';
import { ICustomStorageWrapper } from '@splitsoftware/splitio-commons/src/storages/types';
import { SynchronizerConfigs } from './types';

dotenv.config();

console.log('# Synchronizer: Initialization');

/**
 * The API Url .
 */
let _sdkApiUrl: string | undefined;
/**
 * The Events API Url.
 */
let _eventsApiUrl: string | undefined;
/**
 * The API key value.
 */
let _apikey: string | undefined;
/**
 * The Custom Storage's prefix.
 */
let _storagePrefix: string | undefined;
/**
 * The reference to the provided Storage.
 */
let customStorage: ICustomStorageWrapper;
/**
 * Object that contains Synchronizer's specific configs.
 */
const synchronizerConfigs: SynchronizerConfigs = {
  synchronizerMode: 'MODE_RUN_ALL',
};

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
  .alias('p', 'prefix')
  .nargs('p', 1)
  .alias('c', 'customRun')
  .nargs('c', 1)
  .alias('n', 'eventsPerPost')
  .nargs('n', 1)
  .alias('i', 'impressionsDebug')
  .config('json-file', (configPath) => JSON.parse(fs.readFileSync(configPath, 'utf-8')))
  .describe('m', 'Set config mode: json | env')
  .describe('s', 'Path to the JS file exposing the Storage API')
  .describe('d', 'Set debug Logger enable')
  .describe('k', 'Set the apikey')
  .describe('r', 'Set the Split API URL')
  .describe('e', 'Set the Split Events API URL')
  .describe('p', 'Set the Storage\'s prefix')
  .describe('c', 'Set a custom execution to run: splitsAndSegments | eventsAndImpressions')
  .describe('n', 'Set the number of events to send in a POST request')
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
  prefix,
  STORAGE_PREFIX,
  customRun,
  impressionsDebug,
  eventsPerPost,
  EVENTS_BATCH_SIZE,
} = yargv;

console.log(` > Synchronizer's configs from: ${mode || 'CLI params'}`);

switch (mode) {
  case 'json':
    _apikey = APIKEY as string;
    _sdkApiUrl = API_URL as string;
    _eventsApiUrl = EVENTS_API_URL as string;
    _storagePrefix = STORAGE_PREFIX as string;
    synchronizerConfigs.eventsPerPost = EVENTS_BATCH_SIZE as number;
    break;
  case 'env':
    _apikey = env.APIKEY;
    _sdkApiUrl = env.API_URL;
    _eventsApiUrl = env.EVENTS_API_URL;
    _storagePrefix = env.STORAGE_PREFIX as string;
    synchronizerConfigs.eventsPerPost = env.EVENTS_BATCH_SIZE as unknown as number;
    break;
  default:
    _apikey = apikey as string;
    _sdkApiUrl = apiUrl as string;
    _eventsApiUrl = eventsApiUrl as string;
    _storagePrefix = prefix as string;
    synchronizerConfigs.eventsPerPost = eventsPerPost as number;
    break;
}

switch (customRun) {
  case 'splitsAndSegments':
    synchronizerConfigs.synchronizerMode = 'MODE_RUN_SPLIT_SEGMENTS';
    break;
  case 'eventsAndImpressions':
    synchronizerConfigs.synchronizerMode = 'MODE_RUN_EVENTS_IMPRESSIONS';
    break;
  case undefined:
    synchronizerConfigs.synchronizerMode = 'MODE_RUN_ALL';
    break;
  default:
    console.log(`Error: invalid custom execution parameter: ${customRun}`);
    exit(0);
}

try {
  customStorage = require(storage as string).default;
} catch (error) {
  console.log('Error importing Storage', error);
  exit(0);
}

if (!_apikey) {
  console.log('Unable to initialize Synchronizer task: missing APIKEY.');
  exit(0);
}

/**
 * Settings creation.
 */
const settings = synchronizerSettingsValidator({
  core: {
    authorizationKey: _apikey,
  },
  urls: {
    sdk: _sdkApiUrl,
    events: _eventsApiUrl,
  },
  storage: {
    type: 'CUSTOM',
    prefix: _storagePrefix,
    wrapper: customStorage,
  },
  sync: {
    impressionsMode: impressionsDebug ? 'DEBUG' : 'OPTIMIZED',
  },
  synchronizerConfigs,
  debug: debug || false,
  streamingEnabled: false,
});

if (!validateApiKey(settings.log, _apikey)) {
  console.log('Unable to initialize Synchronizer task: invalid APIKEY.');
  exit(0);
}

const manager = new SynchronizerManager(settings);

manager.execute().then((res) => {
  if (!res) {
    console.log('# Synchronizer execution terminated.');
    exit(1);
  }
});
