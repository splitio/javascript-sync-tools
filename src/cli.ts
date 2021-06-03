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
 * The API Url to be set for this example.
 */
let apiUrl: string | undefined;
/**
 * The API key value.
 */
let apikey: string | undefined;
let customStorage: ICustomStorageWrapper;

const yargv = yargs(hideBin(argv))
  .usage('Usage: $0 [options]')
  .command('sync', 'Start synchronising tasks.')
  .example('$0 -m json --config path2/file.json -s path2/storage.js', '| Set settings from JSON file.')
  .example('$0 -m env -s path2/storage.js', '| Set settings from .env file.')
  .alias('s', 'storage')
  .nargs('s', 1)
  .alias('m', 'mode')
  .nargs('m', 1)
  .config('json-file', function (configPath) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  })
  .describe('m', 'Set config mode: json | env')
  .describe('s', 'Path to the JS file exposing the Storage API')
  .demandOption(['m', 's'])
  .help('h')
  .alias('h', 'help')
  .epilog('copyright 2021')
  .argv;

const { mode, storage, APIKEY, API_URL } = yargv;

console.log(`> Synchroniser's configs from: ${mode}`);

switch (mode) {
  case 'json':
    apikey = APIKEY as string;
    apiUrl = API_URL as string;
    break;
  case 'env':
    apikey = env.APIKEY;
    apiUrl = env.API_URL;
    break;
  default:
    console.log('----');
    break;
}

try {
  customStorage = require(storage as string).default;
} catch (error) {
  console.log('Error importing Storage', error.message);
  exit(0);
}

if (!apiUrl || !apikey) {
  console.log('Unable to initialize Synchroniser task: Invalid or missing settings.');
  exit(0);
}
/**
 * Settings creation.
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
  storage: {
    type: 'CUSTOM',
    prefix: 'InMemoryWrapper',
    // @ts-ignore
    wrapper: customStorage,
  },
});

if (!validateApiKey(settings.log, apikey)) {
  console.log('Missing APIKEY configuration.');
  exit(0);
}

const manager = new SynchroniserManager(settings);

manager.execute();
