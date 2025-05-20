// Type definitions for Split JavaScript Sync Tools
// Project: https://www.split.io/
// Definitions by: Emiliano Sanchez <https://github.com/EmilianoSanchez/>
import { RequestOptions } from 'http';

export = JsSyncTools;

declare module JsSyncTools {
  /**
   * JavaScript synchronizer tool.
   *
   * @see {@link https://help.split.io/hc/en-us/articles/4421513571469-Split-JavaScript-synchronizer-tools}.
   */
  export class Synchronizer {
    /**
     * Creates a new Synchronizer instance
     * @param config - The synchronizer config object
     */
    constructor(config: ISynchronizerSettings);
    /**
     * Execute synchronization
     * @param cb - Optional error-first callback to be invoked when the synchronization ends. The callback will be invoked with an error as first argument if the synchronization fails.
     * @returns A promise that resolves when the operation ends, with a boolean indicating if operation succeeded or not. The promise never rejects.
     */
    execute(cb?: (err?: Error) => void): Promise<boolean>;
    // @TODO expose settings eventually
    // settings: ISettings
  }

  /**
   * Log levels.
   */
  type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'NONE';
  /**
   * Available URL settings for the synchronizer.
   */
  type UrlSettings = {
    /**
     * String property to override the base URL where the synchronizer will get feature flagging related data like a feature flag rollout plan or segments information.
     *
     * @defaultValue `'https://sdk.split.io/api'`
     */
    sdk?: string
    /**
     * String property to override the base URL where the synchronizer will post impressions and events.
     *
     * @defaultValue `'https://events.split.io/api'`
     */
    events?: string,
    /**
     * String property to override the base URL where the synchronizer will post telemetry data.
     *
     * @defaultValue `'https://telemetry.split.io/api'`
     */
    telemetry?: string
  };

  /**
   * SplitFilter type.
   */
  type SplitFilterType = 'byName' | 'bySet';
  /**
   * Defines a feature flag filter, described by a type and list of values.
   */
  interface SplitFilter {
    /**
     * Type of the filter.
     */
    type: SplitFilterType,
    /**
     * List of values: feature flag names for 'byName' filter type, and feature flag name prefixes for 'byPrefix' type.
     */
    values: string[],
  }
  /**
   * ImpressionsMode type.
   */
  type ImpressionsMode = 'OPTIMIZED' | 'DEBUG';
  /**
   * Settings interface for Synchronizer instances.
   *
   * @see {@link https://help.split.io/hc/en-us/articles/4421513571469-Split-JavaScript-synchronizer-tools#configuration}
   */
  interface ISynchronizerSettings {
    /**
     * Core settings.
     */
    core: {
      /**
       * Your SDK key.
       *
       * @see {@link https://help.split.io/hc/en-us/articles/360019916211-API-keys}
       */
      authorizationKey: string
    }
    /**
     * Defines which kind of storage we should instantiate.
     */
    storage: {
      /**
       * Storage type. The only possible value is "PLUGGABLE", which is the default.
       */
      type?: 'PLUGGABLE',
      /**
       * A valid storage instance.
       */
      wrapper: Object
      /**
       * Optional prefix added to the storage keys to prevent any kind of data collision between SDK versions.
       *
       * @defaultValue `'SPLITIO'`
       */
      prefix?: string
    }
    /**
     * List of URLs that the Synchronizer will use as base for it's synchronization functionalities.
     * Do not change these settings unless you're working an advanced use case, like connecting to a proxy.
     */
    urls?: UrlSettings
    /**
     * Boolean value to indicate whether the logger should be enabled or disabled by default, or a log level string.
     *
     * Examples:
     * ```typescript
     * config.debug = true
     * config.debug = 'WARN'
     * ```
     * @defaultValue `false`
     */
    debug?: boolean | LogLevel
    /**
     * Synchronization settings.
     */
    sync?: {
      /**
       * List of feature flag filters. These filters are used to fetch a subset of the feature flag definitions in your environment.
       *
       * Example:
       * ```
       * splitFilter: [
       *   { type: 'byName', values: ['my_feature_flag_1', 'my_feature_flag_2'] }, // will fetch feature flags named 'my_feature_flag_1' and 'my_feature_flag_2'
       * ]
       * ```
       */
      splitFilters?: SplitFilter[]
      /**
       * Feature Flag Spec version. Option to determine which version of the feature flag definitions are fetched and stored.
       * Possible values are `'1.0'`, `'1.1'`, `'1.2'`, and `'1.3'`.
       *
       * @defaultValue `'1.3'`
       */
      flagSpecVersion?: '1.0' | '1.1' | '1.2' | '1.3'
      /**
       * Impressions Collection Mode. Option to determine how impressions are going to be sent to Split Servers.
       *
       * Possible values are 'DEBUG' and 'OPTIMIZED'.
       * - DEBUG: will send all the impressions generated (recommended only for debugging purposes).
       * - OPTIMIZED: will send unique impressions to Split Servers avoiding a considerable amount of traffic that duplicated impressions could generate.
       *
       * @defaultValue `'OPTIMIZED'`
       */
      impressionsMode?: ImpressionsMode
      /**
       * Custom options object for HTTP(S) requests in Node.js.
       * If provided, this object is merged with the options object passed for Node-Fetch calls.
       * @see {@link https://www.npmjs.com/package/node-fetch#options}
       */
      requestOptions?: {
        /**
         * Custom function called before each request, allowing you to add or update headers in Synchronizer HTTP requests.
         * Some headers, such as `SplitSDKVersion`, are required by the Synchronizer and cannot be overridden.
         * To pass multiple headers with the same name, combine their values into a single line, separated by commas. Example: `{ 'Authorization': 'value1, value2' }`
         * Or provide keys with different cases since headers are case-insensitive. Example: `{ 'authorization': 'value1', 'Authorization': 'value2' }`
         *
         * @defaultValue `undefined`
         *
         * @param context - The context for the request, which contains the `headers` property object representing the current headers in the request.
         * @returns An object representing a set of headers to be merged with the current headers.
         *
         * @example
         * ```
         * const getHeaderOverrides = (context) => {
         *   return {
         *     'Authorization': context.headers['Authorization'] + ', other-value',
         *     'custom-header': 'custom-value'
         *   };
         * };
         * ```
         */
        getHeaderOverrides?: (context: { headers: Record<string, string> }) => Record<string, string>;
        /**
         * Custom Node.js HTTP(S) Agent used for HTTP(S) requests.
         *
         * You can use it, for example, for certificate pinning or setting a network proxy:
         *
         * ```javascript
         * const { HttpsProxyAgent } = require('https-proxy-agent');
         *
         * const proxyAgent = new HttpsProxyAgent(process.env.HTTPS_PROXY || 'http://10.10.1.10:1080');
         *
         * const synchronizer = Synchronizer({
         *   ...
         *   sync: {
         *     requestOptions: {
         *       agent: proxyAgent
         *     }
         *   }
         * })
         * ```
         *
         * @see {@link https://nodejs.org/api/https.html#class-httpsagent}
         *
         * @defaultValue `undefined`
         */
        agent?: RequestOptions['agent']
      },
    }
    /**
     * Scheduler settings.
     */
    scheduler?: {
      /**
       * Maximum number of impressions to send per POST request.
       * @defaultValue `1000`
       */
      impressionsPerPost?: number
      /**
       * Maximum number of events to send per POST request.
       * @defaultValue `1000`
       */
      eventsPerPost?: number
      /**
       * Maximum number of retry attempts for posting impressions and events.
       * @defaultValue `3`
       */
      maxRetries?: number
    }
  }
}
