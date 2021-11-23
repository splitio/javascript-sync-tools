// Type definitions for Split Javascript Synchronizer
// Project: http://www.split.io/
// Definitions by: Emiliano Sanchez <https://github.com/EmilianoSanchez/>

export = JsSynchronizer;

declare module JsSynchronizer {
  /**
   * Javascript synchronizer.
   *
   * @see {@link @TODO}.
   */
  export class Synchronizer {
    // @TODO document each method
    constructor(config: ISynchronizerSettings);
    execute(): Promise<boolean>;
    // @TODO expose settings in the beta?
    // settings: ISettings
  }

  /**
   * Log levels.
   *
   * @typedef {string} LogLevel
   */
  type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'NONE';
  /**
   * Available URL settings for the synchronizer.
   */
  type UrlSettings = {
    /**
     * String property to override the base URL where the synchronizer will get feature flagging related data like a Split rollout plan or segments information.
     *
     * @property {string} sdk
     * @default 'https://sdk.split.io/api'
     */
    sdk?: string
    /**
     * String property to override the base URL where the synchronizer will post impressions and events.
     *
     * @property {string} events
     * @default 'https://events.split.io/api'
     */
    events?: string
  };

  /**
   * SplitFilter type.
   *
   * @typedef {string} SplitFilterType
   */
  type SplitFilterType = 'byName' | 'byPrefix';
  /**
   * Defines a split filter, described by a type and list of values.
   */
  interface SplitFilter {
    /**
     * Type of the filter.
     *
     * @property {SplitFilterType} type
     */
    type: SplitFilterType,
    /**
     * List of values: split names for 'byName' filter type, and split prefixes for 'byPrefix' type.
     *
     * @property {string[]} values
     */
    values: string[],
  }
  /**
   * ImpressionsMode type.
   *
   * @typedef {string} ImpressionsMode
   */
  type ImpressionsMode = 'OPTIMIZED' | 'DEBUG';
  /**
   * SynchronizerMode type.
   *
   * @typedef {string} SynchronizerMode
   */
  type SynchronizerMode = 'MODE_RUN_ALL' | 'MODE_RUN_EVENTS_IMPRESSIONS' | 'MODE_RUN_SPLIT_SEGMENTS';
  /**
   * Settings interface for Synchronizer instances.
   *
   * @interface ISynchronizerSettings
   * @see {@link @TODO#configuration}
   */
  interface ISynchronizerSettings {
    /**
     * Core settings.
     *
     * @property {Object} core
     */
    core: {
      /**
       * Your API key. More information: @see {@link https://help.split.io/hc/en-us/articles/360019916211-API-keys}
       *
       * @property {string} authorizationKey
       */
      authorizationKey: string
    }
    /**
     * Defines which kind of storage we should instanciate.
     *
     * @property {Object} storage
     */
    storage: {
      /**
       * Storage wrapper.
       *
       * @property {Object} wrapper
       */
      wrapper: Object
      /**
       * Optional prefix to prevent any kind of data collision between multiple instances.
       *
       * @property {string} prefix
       * @default SPLITIO
       */
      prefix?: string
    }
    /**
     * List of URLs that the Synchronizer will use as base for it's synchronization functionalities.
     * Do not change these settings unless you're working an advanced use case, like connecting to a proxy.
     *
     * @property {Object} urls
     */
    urls?: UrlSettings
    /**
     * Boolean value to indicate whether the logger should be enabled or disabled by default, or a log level string.
     *
     * @see {@link @TODO#logging}
     *
     * Examples:
     * ```typescript
     * config.debug = true
     * config.debug = 'WARN'
     * ```
     * @property {boolean | LogLevel | ILogger} debug
     * @default false
     */
    debug?: boolean | LogLevel
    /**
     * Synchronization settings.
     * @property {Object} sync
     */
    sync?: {
      /**
       * List of Split filters. These filters are used to fetch a subset of the Splits definitions in your environment.
       *
       * At the moment, two types of split filters are supported: by name and by prefix.
       *
       * Example:
       *  `splitFilter: [
       *    { type: 'byName', values: ['my_split_1', 'my_split_2'] }, // will fetch splits named 'my_split_1' and 'my_split_2'
       *    { type: 'byPrefix', values: ['testing'] } // will fetch splits whose names start with 'testing__' prefix
       *  ]`
       * @property {SplitFilter[]} splitFilters
       */
      splitFilters?: SplitFilter[]
      /**
       * Impressions Collection Mode. Option to determine how impressions are going to be sent to Split Servers.
       *
       * Possible values are 'DEBUG' and 'OPTIMIZED'.
       * - DEBUG: will send all the impressions generated (recommended only for debugging purposes).
       * - OPTIMIZED: will send unique impressions to Split Servers avoiding a considerable amount of traffic that duplicated impressions could generate.
       *
       * @property {String} impressionsMode
       * @default 'OPTIMIZED'
       */
      impressionsMode?: ImpressionsMode
    }
    /**
     * Type for specific Synchronizer's configs.
     */
    synchronizerConfigs: {
      // @TODO document
      synchronizerMode?: SynchronizerMode
      eventsPerPost?: number
      impressionsPerPost?: number
      maxRetries?: number
    }
  }
}
