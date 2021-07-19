import { IMetadata } from '@splitsoftware/splitio-commons/src/dtos/types';
import { ImpressionDTO } from '@splitsoftware/splitio-commons/src/types';

export type ImpressionsDTOWithMetadata = {
  metadata: IMetadata;
  impression: ImpressionDTO;
}

export type executionMode = 'MODE_RUN_ALL' | 'MODE_RUN_EVENTS_IMPRESSIONS' | 'MODE_RUN_SPLIT_SEGMENTS';
