import { IMetadata } from '@splitsoftware/splitio-commons/types/dtos/types';

/**
 * Function to generate the Metadata Headers required for Impressions and Events POST requests.
 *
 * @param {IMetadata} metadata  The object containing the Metadata SDK Version, IP and Machine name.
 * @returns {{ SplitSDKVersion: string, SplitSDKMachineIP: string, SplitSDKMachineName: string }}
 */
export const metadataToHeaders = (metadata: IMetadata) => {
  return { SplitSDKVersion: metadata.s, SplitSDKMachineIP: metadata.i, SplitSDKMachineName: metadata.n };
};
/**
 * Function to process a list of Objects, and group them by any unique key that is defined as
 * as desire when executing the function. It returns a Map with -n array of elements grouped
 * by the desired key.
 *
 * @param {Array<any>} listOfElements  The Array of Objects to process.
 * @param {string}     objectKey       The Key name to define how to group the list of elements.
 * @returns {any}
 */
export function groupByMetadata(listOfElements: Array<any>, objectKey: string): {[metadataAsKey: string]: Array<any>} {
  const _resultMap: any = {};

  listOfElements.forEach((e) => {
    const metadataKey = JSON.stringify(e[objectKey]);
    if (!_resultMap[metadataKey]) _resultMap[metadataKey] = [];
    _resultMap[metadataKey].push(e);
  });

  return _resultMap;
}
