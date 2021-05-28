/* eslint-disable no-magic-numbers */
import ImpressionCountsCacheInMemory from
  '@splitsoftware/splitio-commons/src/storages/inMemory/ImpressionCountsCacheInMemory';
import { impressionsSubmitterFactory } from '../synchroniserImpressionsSubmitter';
import { getImpressionSampleWithNoMetadata, getImpressionsListWithSameMetadata } from './impressionsMockUtils';
import { impressionObserverSSFactory } from
  '@splitsoftware/splitio-commons/src/trackers/impressionObserver/impressionObserverSS';
import exp from 'constants';

describe('Impressions Submitter for Lightweight Synchroniser', () => {
  const _postImpressionsMock = jest.fn(() => Promise.resolve());
  const _impressionsCacheMock = {
    popNWithMetadata: jest.fn(),
  };

  const _impressionsCountsModuleMock = {
    observer: impressionObserverSSFactory(),
    countsCache: new ImpressionCountsCacheInMemory(),
  };

  const _impressionsSubmiter = impressionsSubmitterFactory(
    // @ts-ignore
    _postImpressionsMock,
    _impressionsCacheMock,
    _impressionsCountsModuleMock
  );

  afterEach(() => {
    _postImpressionsMock.mockClear();
    _impressionsCacheMock.popNWithMetadata.mockClear();
  });

  test('Pop 2 Impressions from Storage and make an Impressions POST with one impressions', async () => {
    const _mockImpressionsListWMetadata = getImpressionsListWithSameMetadata(2, true);
    const { m: {s, i, n}} = _mockImpressionsListWMetadata[0];
    _impressionsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve((_mockImpressionsListWMetadata)));

    const res = await _impressionsSubmiter();

    expect(_impressionsCacheMock.popNWithMetadata).toBeCalledWith(1000);
    expect(_postImpressionsMock).toBeCalledWith(JSON.stringify([{
      metadata: {n, i, s},
      impression: getImpressionSampleWithNoMetadata(),
    }]));
    expect(res).toBe(true);
  });
});

