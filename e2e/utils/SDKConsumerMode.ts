import { SplitFactory } from '@splitsoftware/splitio';
import { PluggableStorage } from '@splitsoftware/splitio-commons/src/storages/pluggable';
import { OPTIMIZED } from '@splitsoftware/splitio-commons/src/utils/constants';
import { ImpressionsMode } from '@splitsoftware/splitio/types/splitio';
import { PREFIX, REDIS_URL } from './constants';
import redisAdapterWrapper from './redisAdapterWrapper';

const config = {
  mode: 'consumer', // changing the mode to consuemer here
  core: {
    authorizationKey: 'fakeSdkKey',
  },
  storage: {
    type: 'REDIS',
    options: {
      url: REDIS_URL,
    },
    prefix: PREFIX,
  },
};

/**
 * Function to run an example SDK in Consumer mode, in order to generate Events and Impressions
 * to be then processed by the Synchronizer.
 *
 * @param impressionsMode - Impressions mode.
 */
export default function runSDKConsumer(impressionsMode: ImpressionsMode) {
  const factory = SplitFactory({
    ...config,
    sync: {
      impressionsMode,
    }, // @ts-ignore
  }, (modules) => {
    // Using pluggable storage in Node.js
    modules.storageFactory = PluggableStorage({
      prefix: modules.settings.storage.prefix,
      wrapper: redisAdapterWrapper(modules.settings.storage.options),
    });
  });

  const client = factory.client();
  var manager = factory.manager();

  return new Promise<void>((res) => {
    client.on(client.Event.SDK_READY, async function () {
      const splitNames = await manager.names();

      for (let i = 0; i < splitNames.length; i++) {
        await client.getTreatment(`redo${i}`, splitNames[i]);
        // Use impressions counts cache if mode is OPTIMIZED
        if (impressionsMode === OPTIMIZED) await client.getTreatment(`redo${i}`, splitNames[i]);
      }

      await client.track('john@doe.com', 'user', 'page_load_time', 83.334);

      const properties = { package: 'premium', admin: true, discount: 50 };
      await client.track('john@doe.com', 'user', 'page_load_time', 83.334, properties);

      await client.destroy();
      res();
    });
  });

}
