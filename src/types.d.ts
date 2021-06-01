import { IMetadata } from '@splitsoftware/splitio-commons/src/dtos/types';
import { ImpressionDTO } from '@splitsoftware/splitio-commons/src/types';

export type ImpressionsDTOWithMetadata = {
  metadata: IMetadata;
  impression: ImpressionDTO;
}
