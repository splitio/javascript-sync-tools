/* eslint-disable no-magic-numbers */
import { SplitFactory } from '@splitsoftware/splitio';
import { PREFIX, REDIS_URL } from './constants';

const config = {
  mode: 'consumer', // changing the mode to consuemer here
  core: {
    authorizationKey: 'fakeapikey',
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
 * @returns {Promise}
 */
const runSDKConsumer = () => {
  // @ts-ignore
  const factory = SplitFactory(config);
  const client = factory.client();
  var manager = factory.manager();

  return new Promise((res) => {
    client.on(client.Event.SDK_READY, async function () {
      const splitNames = await manager.names();

      for (let i = 0; i < splitNames.length; i++) {
        await client.getTreatment(`redo${i}`, splitNames[i]);
      }

      await client.track('john@doe.com', 'user', 'page_load_time', 83.334);

      const properties = { package: 'premium', admin: true, discount: 50 };
      await client.track('john@doe.com', 'user', 'page_load_time', 83.334, properties);

      return res(true);
    });
  });

};

export default runSDKConsumer;
