/**
 * Reference to the package version that is going to be overwritten when building the app
 * for the corresponding value.
 */
const version = '@VERSION@';

/**
 * Default values to create settings for the Javascrip Synchronizer.
 */
export const defaults = {
  startup: {
    // Stress the request time used while starting up the SDK.
    requestTimeoutBeforeReady: 5,
    // How many quick retries we will do while starting up the SDK.
    retriesOnFailureBeforeReady: 1,
    // Maximum amount of time used before notifies me a timeout.
    readyTimeout: 10,
    // Amount of time we will wait before the first push of events.
    eventsFirstPushWindow: 10,
  },
  scheduler: {
    // @TODO check synchronizerMode
    // synchronizerMode: 'MODE_RUN_ALL',
    // Number of impressions to send in a POST request.
    impressionsPerPost: 1000,
    // Number of events to send in a POST request.
    eventsPerPost: 1000,
    // Number of retry attempts for posting impressions and events.
    maxRetries: 3,
  },
  version: `synctoolsjs-${version}`,
  streamingEnabled: false,
};
