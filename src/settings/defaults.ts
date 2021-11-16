/**
 * Reference to the package version that is going to be overwritten when building the app
 * for the corresponding value.
 */
const version = '@VERSION@';

/**
 * Default values to create settings for the Synchronizer script.
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
  version: `synchronizer-${version}`,
  streamingEnabled: false,
};
