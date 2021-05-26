import { IMetadata } from '@splitsoftware/splitio-commons/types/dtos/types';

/**
 * Function to generate the Metadata Headerd required for Impressions and Events POST requests.
 *
 * @param {IMetadata} metadata  The object containing the Metadata SDK Version, IP and Machine name.
 * @returns {{ SplitSDKVersion: string, SplitSDKMachineIP: string, SplitSDKMachineName: string }}
 */
export const metadataToHeaders = (metadata: IMetadata) => {
  return { SplitSDKVersion: metadata.s, SplitSDKMachineIP: metadata.i, SplitSDKMachineName: metadata.n };
};
