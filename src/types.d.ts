import { IMetadata } from '@splitsoftware/splitio-commons/src/dtos/types';
import ImpressionCountsCacheInMemory from
  '@splitsoftware/splitio-commons/src/storages/inMemory/ImpressionCountsCacheInMemory';
import ImpressionObserver from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/ImpressionObserver';
import { ImpressionDTO } from '@splitsoftware/splitio-commons/src/types';

export type ImpDedupModule = {
  observer: ImpressionObserver;
  countsCache: ImpressionCountsCacheInMemory;
}

export type ImpressionsDTOWithMetadata = {
  metadata: IMetadata;
  impression: ImpressionDTO;
}
