import fs from 'fs';
import { exit, env, argv } from 'process';
import { synchroniserSettingsValidator } from './settings';
import { SynchroniserManager } from './manager';
import { validateApiKey } from '@splitsoftware/splitio-commons/src/utils/inputValidation';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import dotenv from 'dotenv';
import { inMemoryStorageFactory } from './storages/InMemoryStorage';

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

const yargv = yargs(hideBin(argv))
  .usage('Usage: $0 [options]')
  .command('sync', 'Start synchronising tasks.')
  .example('$0 -m json --config path2/file.json ', '| Set settings from JSON file.')
  .example('$0 -m env', '| Set settings from .env file.')
  .alias('m', 'mode')
  .nargs('m', 1)
  .config('configs', function (configPath) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  })
  .describe('b', 'Set config mode: json | env')
  .demandOption(['m'])
  .help('h')
  .alias('h', 'help')
  .epilog('copyright 2021')
  .argv;

const { mode, APIKEY, API_URL } = yargv;

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

if (!apiUrl || !apikey) {
  console.log('Unable to initialize Synchroniser task: Invalid or missing settings.');
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
  storage: {
    type: 'CUSTOM',
    prefix: 'InMemoryWrapper',
    wrapper: inMemoryStorageFactory(),
  },
});

if (!validateApiKey(settings.log, apikey)) {
  console.log('Missing APIKEY configuration.');
  exit(0);
}

const manager = new SynchroniserManager(settings);

manager.execute();
