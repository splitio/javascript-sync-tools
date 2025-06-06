import type SplitIO from '@splitsoftware/splitio-commons/types/splitio';
import { StoredImpressionWithMetadata } from '@splitsoftware/splitio-commons/src/sync/submitters/types';
import { _getRandomString } from './commonUtils';

/**
 * An Impression example.
 */
const impressionFullNameNoMetadata: SplitIO.ImpressionDTO = {
  keyName: 'marcio@split.io',
  bucketingKey: 'impr_bucketing_2',
  feature: 'qc_team',
  treatment: 'no',
  label: 'default rule',
  changeNumber: 828282828282,
  time: Date.now(),
  properties: '{"key":"value"}',
};
/**
 * An Impression with Metadata example.
 */
const impressionWithMetadata: StoredImpressionWithMetadata = {
  m: {
    s: 'go-6.1.0',
    i: '192.168.0.6',
    n: 'ip-192-168-0-6',
  },
  i: {
    f: 'qc_team',
    k: 'marcio@split.io',
    t: 'no',
    m: Date.now(),
    b: 'impr_bucketing_2',
    r: 'default rule',
    c: 828282828282,
    properties: '{"key":"value"}',
  },
};
/**
 * Function go return an Impression with a Random generated metadata.
 */
function getRandomizeMetadata(): StoredImpressionWithMetadata {
  const { i, s } = impressionWithMetadata.m;
  return Object.assign(
    {},
    impressionWithMetadata,
    { m: { n: _getRandomString(14), i, s } }
  );
}
/**
 * Function generate a random value for the "value" in an example impression,
 * and then return that Impression.
 */
function getRandomizeImpression(): StoredImpressionWithMetadata {
  const { k, t, m, b, r, c, properties } = impressionWithMetadata.i;
  return Object.assign(
    {},
    impressionWithMetadata,
    { i: { k, t, m, b, r, c, properties, f: _getRandomString(12) } }
  );
}
/**
 * Function to return an Impression with its full Key's name and no metadata.
 */
export function getImpressionSampleWithNoMetadata(): SplitIO.ImpressionDTO {
  return impressionFullNameNoMetadata;
}
/**
 *  Function to generate a list of Impressions with the same metadata.
 *
 * @param len - The amount of Impressions to generate.
 * @param randomizeMetadata - Flag to determine if Metadata needs to be randomly generated.
 * @param randomizeImpression - Flag to determine if Impression data needs to be randomly generated.
 * @returns An array of Impressions with the metadata.
 */
export function getImpressionsListWithSameMetadata(
  len: number,
  randomizeMetadata = false,
  randomizeImpression = false
): StoredImpressionWithMetadata[] {
  const _impressionTarget = {
    m: randomizeMetadata ? getRandomizeMetadata().m : impressionWithMetadata.m,
    i: randomizeImpression ? getRandomizeImpression().i : impressionWithMetadata.i,
  };

  return [...Array(len).keys()].map(() => _impressionTarget);
}
