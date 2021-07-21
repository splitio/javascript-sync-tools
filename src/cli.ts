import fs from 'fs';
import { exit, env, argv } from 'process';
import { synchronizerSettingsValidator } from './';
import { Synchronizer } from './';
import { validateApiKey } from '@splitsoftware/splitio-commons/src/utils/inputValidation';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import dotenv from 'dotenv';
import { ICustomStorageWrapper } from '@splitsoftware/splitio-commons/src/storages/types';
import { SynchronizerConfigs } from './types';

type CustomModeOption = 'splitsAndSegments' | 'eventsAndImpressions' | undefined;

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
 * The reference to the provided Storage's path file.
 */
let _customStoragePath: string;
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

// @todo: refactor param alias and args to be all wrapped under the `options` function.
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
  .options({
    c: {
      alias: 'customRun',
      type: 'string',
      description: 'Set a custom execution to run: splitsAndSegments | eventsAndImpressions',
      choices: ['splitsAndSegments', 'eventsAndImpressions'],
    },
    s: {
      alias: 'storage',
      describe: 'Path to the JS file exposing the Storage API',
      type: 'string',
      nargs: 1,
    },
    d: {
      alias: 'debug',
      describe: 'Set debug Logger enable',
      type: 'string',
      nargs: 0,
    },
    k: {
      alias: 'apikey',
      describe: 'Set the apikey',
      type: 'string',
      nargs: 1,
    },
    r: {
      alias: 'apiUrl',
      describe: 'Set the Split API URL',
      type: 'string',
      nargs: 1,
    },
    e: {
      alias: 'eventsApiUrl',
      describe: 'Set the Split Events API URL',
      type: 'string',
      nargs: 1,
    },
    m: {
      alias: 'mode',
      type: 'string',
      description: 'Set config mode: json | env',
      choices: ['env', 'json'],
      nargs: 1,
    },
    p: {
      alias: 'prefix',
      describe: 'Set the Storage\'s prefix',
      type: 'string',
      nargs: 1,
    },
    n: {
      alias: 'eventsPerPost',
      description: 'Set the number of events to send in a POST request',
      nargs: 1,
    },
    f: {
      alias: 'impressionsPerPost',
      description: 'Set the number of impressions to send in a POST request',
      nargs: 1,
    },
    t: {
      alias: 'maxRetries',
      description: 'Set the number of retries attempt perform an Event\'s a POST request',
      nargs: 1,
    },
    i: {
      alias: 'impressionsMode',
      type: 'string',
      description: 'This configuration defines how impressions are queued: optimized | debug',
      choices: ['optimized', 'debug'],
      nargs: 1,
    },
  })
  .config('json-file', (configPath) => JSON.parse(fs.readFileSync(configPath, 'utf-8')))
  .help('h')
  .alias('h', 'help')
  .epilog(`copyright ${new Date().getFullYear()}`)
  .argv;

const {
  mode,
  storage,
  STORAGE_PATH,
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
  CUSTOM_RUN,
  impressionsMode,
  eventsPerPost,
  impressionsPerPost,
  maxRetries,
  MAX_RETRIES,
  EVENTS_PER_POST,
  IMPRESSIONS_PER_POST,
} = yargv;

console.log(` > Synchronizer's configs from: ${mode || 'CLI params'}`);
/**
 * Function to set the Synchronizer Execution Mode.
 *
 * @param {CustomModeOption} _customRun  Option provided by the CLI or config (env|json).
 */
const setCustomRun = (_customRun: CustomModeOption | undefined) => {
  switch (_customRun) {
    case 'splitsAndSegments':
      synchronizerConfigs.synchronizerMode = 'MODE_RUN_SPLIT_SEGMENTS';
      break;
    case 'eventsAndImpressions':
      synchronizerConfigs.synchronizerMode = 'MODE_RUN_EVENTS_IMPRESSIONS';
      break;
    default:
      synchronizerConfigs.synchronizerMode = 'MODE_RUN_ALL';
  }
};

switch (mode) {
  case 'json':
    _apikey = APIKEY as string;
    _sdkApiUrl = API_URL as string;
    _eventsApiUrl = EVENTS_API_URL as string;
    _storagePrefix = STORAGE_PREFIX as string;
    _customStoragePath = STORAGE_PATH as string;
    synchronizerConfigs.eventsPerPost = EVENTS_PER_POST as number;
    synchronizerConfigs.impressionsPerPost = IMPRESSIONS_PER_POST as number;
    synchronizerConfigs.maxRetries= MAX_RETRIES as number;
    setCustomRun(CUSTOM_RUN as CustomModeOption);
    break;
  case 'env':
    _apikey = env.APIKEY;
    _sdkApiUrl = env.API_URL;
    _eventsApiUrl = env.EVENTS_API_URL;
    _storagePrefix = env.STORAGE_PREFIX as string;
    _customStoragePath = env.STORAGE_PATH as string;
    synchronizerConfigs.eventsPerPost = env.EVENTS_PER_POST as unknown as number;
    synchronizerConfigs.impressionsPerPost = env.IMPRESSIONS_PER_POST as unknown as number;
    synchronizerConfigs.maxRetries = env.MAX_RETRIES as unknown as number;
    setCustomRun(env.CUSTOM_RUN as CustomModeOption);
    break;
  default:
    _apikey = apikey as string;
    _sdkApiUrl = apiUrl as string;
    _eventsApiUrl = eventsApiUrl as string;
    _storagePrefix = prefix as string;
    _customStoragePath = storage as string;
    synchronizerConfigs.eventsPerPost = eventsPerPost as number;
    synchronizerConfigs.impressionsPerPost = impressionsPerPost as number;
    synchronizerConfigs.maxRetries = maxRetries as number;
    setCustomRun(customRun as CustomModeOption);
    break;
}

try {
  customStorage = require(_customStoragePath as string).default;
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
    // @ts-ignore
    impressionsMode: impressionsMode?.toUpperCase() || 'OPTIMIZED',
  },
  synchronizerConfigs,
  debug: debug || false,
});

if (!validateApiKey(settings.log, _apikey)) {
  console.log('Unable to initialize Synchronizer task: invalid APIKEY.');
  exit(0);
}

const manager = new Synchronizer(settings);

manager.execute().then((res) => {
  if (!res) {
    console.log('# Synchronizer execution terminated.');
    exit(1);
  }
});
