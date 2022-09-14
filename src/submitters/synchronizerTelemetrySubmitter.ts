import { ILogger } from '@splitsoftware/splitio-commons/src/logger/types';
import { TelemetryUsageStats } from '@splitsoftware/splitio-commons/src/sync/submitters/types';
import { ITelemetryCacheAsync } from '@splitsoftware/splitio-commons/src/storages/types';
import { metadataToHeaders } from './utils';
import { ISplitApi } from '@splitsoftware/splitio-commons/src/services/types';
import { _Map, IMap } from '@splitsoftware/splitio-commons/src/utils/lang/maps';


/**
 * Function factory that returns a Telemetry Submitter, a function that retrieves configs and usage stats
 * (latencies and exceptions) from the telemetry storage, and submits them to the Split BE.
 * The function returns a promise that never rejects, and resolves to true or false if the operation success or not.
 *
 * @param {ISplitApi}            splitApi        The Split's HTTPClient API to perform the POST request.
 * @param {ITelemetryCacheAsync} telemetryCache  The Telemetry storage Cache from where to retrieve data.
 * @param {ILogger}              logger          The Synchronizer's Logger.
 * @returns {() => Promise<boolean>}
 */
export function telemetrySubmitterFactory(
  splitApi: ISplitApi,
  telemetryCache: ITelemetryCacheAsync,
  logger: ILogger,
): () => Promise<boolean> {

  async function buildUsageStats(): Promise<IMap<string, TelemetryUsageStats>> {
    const latencies = await telemetryCache.popLatencies();
    const exceptions = await telemetryCache.popExceptions();

    const result = new _Map<string, TelemetryUsageStats>();

    latencies.forEach((latencie, metadata) => {
      result.set(metadata, { mL: latencie });
    });

    exceptions.forEach((exception, metadata) => {
      const usageStats = result.get(metadata);
      if (usageStats) {
        usageStats.mE = exception;
      } else {
        result.set(metadata, { mE: exception });
      }
    });

    return result;
  }

  async function synchronizeUsageStats() {
    let usageStats;
    try {
      usageStats = await buildUsageStats();
    } catch (e) {
      logger.error(`An error occurred when retrieving telemetry usage stats from storage: ${e}`);
      return false;
    }

    try {
      // Submit usage stats
      usageStats.forEach(async (usage, metadata) => {
        // No retries for telemetry
        await splitApi.postMetricsUsage(JSON.stringify(usage), metadataToHeaders(JSON.parse(metadata)));
      });
      return true;
    } catch (e) {
      logger.error(`An error occurred when submitting telemetry usage stats: ${e}`);
      return false;
    }
  }

  async function synchronizeConfigs() {
    let configs;
    try {
      configs = await telemetryCache.popConfigs();
    } catch (e) {
      logger.error(`An error occurred when retrieving telemetry configs from storage: ${e}`);
      return false;
    }

    try {
      // Submit configs
      configs.forEach(async (config, metadata) => {
        // No retries for telemetry
        await splitApi.postMetricsConfig(JSON.stringify(config), metadataToHeaders(JSON.parse(metadata)));
      });
      return true;
    } catch (e) {
      logger.error(`An error occurred when submitting telemetry configs: ${e}`);
      return false;
    }
  }

  return async function () {
    return await synchronizeUsageStats() && await synchronizeConfigs();
  };
}
