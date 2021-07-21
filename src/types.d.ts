import { IMetadata } from '@splitsoftware/splitio-commons/src/dtos/types';
import { ImpressionDTO } from '@splitsoftware/splitio-commons/src/types';

export type ImpressionsDTOWithMetadata = {
  metadata: IMetadata;
  impression: ImpressionDTO;
}

export type ExecutionMode = 'MODE_RUN_ALL' | 'MODE_RUN_EVENTS_IMPRESSIONS' | 'MODE_RUN_SPLIT_SEGMENTS';

/**
 * Type for specific Synchronizer's configs.
 */
export type SynchronizerConfigs = {
  synchronizerMode: ExecutionMode;
  eventsPerPost?: number;
  impressionsPerPost?: number;
  maxRetries?: number;
}
