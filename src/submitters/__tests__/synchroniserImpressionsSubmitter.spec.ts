/* eslint-disable no-magic-numbers, max-len*/
import ImpressionCountsCacheInMemory from '@splitsoftware/splitio-commons/src/storages/inMemory/ImpressionCountsCacheInMemory';
import { impressionsSubmitterFactory, impressionWithMetadataToImpressionDTO } from '../synchroniserImpressionsSubmitter';
import { getImpressionsListWithSameMetadata } from './impressionsMockUtils';
import { impressionObserverSSFactory } from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/impressionObserverSS';
import { metadataToHeaders } from '../metadataUtils';

describe('Impressions Submitter for Lightweight Synchroniser', () => {
  const _postImpressionsMock = jest.fn(() => Promise.resolve());
  const _impressionsCacheMock = {
    popNWithMetadata: jest.fn(),
  };

  const observer = impressionObserverSSFactory();
  const countsCache = new ImpressionCountsCacheInMemory();

  afterEach(() => {
    _postImpressionsMock.mockClear();
    _impressionsCacheMock.popNWithMetadata.mockClear();
  });

  describe('Impressions Submitter OPTIMIZED mode set', () => {
    const _impressionsSubmiter = impressionsSubmitterFactory(
      // @ts-ignore
      _postImpressionsMock,
      _impressionsCacheMock,
      observer,
      countsCache,
    );

    test('Pop [2] Impressions with [SAME] Metadata from Storage, then make [1] Impressions POST with [1] Impressions', async () => {
      const _mockImpressionsListWMetadata = getImpressionsListWithSameMetadata(2, true);
      const _mockImpressionToDTO = impressionWithMetadataToImpressionDTO(_mockImpressionsListWMetadata[0]);
      _impressionsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve((_mockImpressionsListWMetadata)));

      const res = await _impressionsSubmiter();

      expect(_impressionsCacheMock.popNWithMetadata).toBeCalledWith(1000);
      expect(_postImpressionsMock).toBeCalledWith(
        JSON.stringify([impressionWithMetadataToImpressionDTO(_mockImpressionsListWMetadata[0]).impression]),
        { ...metadataToHeaders(_mockImpressionToDTO.metadata), SplitSDKImpressionsMode: 'OPTIMIZED' }
      );
      expect(res).toBe(true);
    });

    test('Pop [2] Impressions with [DIFFERENT] Metadata from Storage, then make [2] Impressions POST with [2] Impressions', async () => {
      const _mockImpressionsListWMetadata = [
        ...getImpressionsListWithSameMetadata(1, true, true),
        ...getImpressionsListWithSameMetadata(1, true, true),
      ];
      const impressionList1DTO = impressionWithMetadataToImpressionDTO(_mockImpressionsListWMetadata[0]);
      const impressionList2DTO = impressionWithMetadataToImpressionDTO(_mockImpressionsListWMetadata[1]);

      _impressionsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve((_mockImpressionsListWMetadata)));

      const res = await _impressionsSubmiter();

      expect(_impressionsCacheMock.popNWithMetadata).toBeCalledWith(1000);
      expect(_postImpressionsMock).toHaveBeenNthCalledWith(
        1,
        JSON.stringify([impressionList1DTO.impression]),
        { ...metadataToHeaders(impressionList1DTO.metadata), SplitSDKImpressionsMode: 'OPTIMIZED' }
      );
      expect(_postImpressionsMock).toHaveBeenNthCalledWith(
        2,
        JSON.stringify([impressionList2DTO.impression]),
        { ...metadataToHeaders(impressionList2DTO.metadata), SplitSDKImpressionsMode: 'OPTIMIZED' }
      );
      expect(_postImpressionsMock).toBeCalledTimes(2);

      expect(res).toBe(true);
    });

    test('Pop [20] Impressions, divided in [2] groups of 10 Impressions with [SAME] Metadata from Storage, then make [2] Impressions POST with [1] Impressions each', async () => {
      const _mockImpressionsListWMetadata = [
        ...getImpressionsListWithSameMetadata(10, true, true),
        ...getImpressionsListWithSameMetadata(10, true, true),
      ];
      const impressionList1DTO = _mockImpressionsListWMetadata.slice(0, 9).map(i => impressionWithMetadataToImpressionDTO(i));
      const impressionList2DTO = _mockImpressionsListWMetadata.slice(10, 19).map(i => impressionWithMetadataToImpressionDTO(i));

      _impressionsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve((_mockImpressionsListWMetadata)));

      const res = await _impressionsSubmiter();

      expect(_impressionsCacheMock.popNWithMetadata).toBeCalledWith(1000);
      expect(_postImpressionsMock).toBeCalledTimes(2);
      expect(_postImpressionsMock).toHaveBeenNthCalledWith(
        1,
        JSON.stringify([impressionList1DTO[0].impression]),
        { ...metadataToHeaders(impressionList1DTO[0].metadata), SplitSDKImpressionsMode: 'OPTIMIZED' }
      );
      expect(_postImpressionsMock).toHaveBeenNthCalledWith(
        2,
        JSON.stringify([impressionList2DTO[0].impression]),
        { ...metadataToHeaders(impressionList2DTO[0].metadata), SplitSDKImpressionsMode: 'OPTIMIZED' }
      );
      // @ts-ignore
      expect(JSON.parse(_postImpressionsMock.mock.calls[0][0]).length).toEqual(1);
      // @ts-ignore
      expect(JSON.parse(_postImpressionsMock.mock.calls[1][0]).length).toEqual(1);
      expect(res).toBe(true);
    });
  });

  describe('Impressions Submitter DEBUG mode set', () => {
    const _impressionsSubmiter = impressionsSubmitterFactory(
      // @ts-ignore
      _postImpressionsMock,
      _impressionsCacheMock,
      observer,
      undefined,
    );

    test('Pop [2] Impressions with [SAME] metadata from Storage, then make [1] Impressions POST with [2] impressions', async () => {
      const _mockImpressionsListWMetadata = getImpressionsListWithSameMetadata(2, true);
      const _mockImpressionsListToDTO = _mockImpressionsListWMetadata.map(i => impressionWithMetadataToImpressionDTO(i));
      _impressionsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve((_mockImpressionsListWMetadata)));

      const res = await _impressionsSubmiter();

      expect(_impressionsCacheMock.popNWithMetadata).toBeCalledWith(1000);
      // The reason we are parsing the object and validating its keys (and its according value type) is because
      // the `pt` key only exists in some impressions, and comparing the stringigy version of the parameter in the
      // call againts the expected stringify value is not going to work.
      // @ts-ignore
      expect(JSON.parse(_postImpressionsMock.mock.calls[0][0]).pop()).toEqual(
        expect.objectContaining({
          keyName: expect.any(String),
          bucketingKey: expect.any(String),
          feature: expect.any(String),
          treatment: expect.any(String),
          label: expect.any(String),
          changeNumber: expect.any(Number),
          time: expect.any(Number),
          pt: expect.any(Number),
        })
      );
      // @ts-ignore
      expect(_postImpressionsMock.mock.calls[0][1]).toStrictEqual(
        { ...metadataToHeaders(_mockImpressionsListToDTO[0].metadata), SplitSDKImpressionsMode: 'DEBUG' }
      );
      expect(res).toBe(true);
    });

    test('Pop [2] Impressions with [DIFFERENT] metadata from Storage, then make [2] Impressions POST with [1] impression each', async () => {
      const _mockImpressionsListWMetadata = [
        ...getImpressionsListWithSameMetadata(1, true, true),
        ...getImpressionsListWithSameMetadata(1, true, true),
      ];
      const impressionList1DTO = impressionWithMetadataToImpressionDTO(_mockImpressionsListWMetadata[0]);
      const impressionList2DTO = impressionWithMetadataToImpressionDTO(_mockImpressionsListWMetadata[1]);

      _impressionsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve((_mockImpressionsListWMetadata)));

      const res = await _impressionsSubmiter();

      expect(_impressionsCacheMock.popNWithMetadata).toBeCalledWith(1000);
      expect(_postImpressionsMock).toHaveBeenNthCalledWith(
        1,
        JSON.stringify([impressionList1DTO.impression]),
        { ...metadataToHeaders(impressionList1DTO.metadata), SplitSDKImpressionsMode: 'DEBUG' }
      );
      expect(_postImpressionsMock).toHaveBeenNthCalledWith(
        2,
        JSON.stringify([impressionList2DTO.impression]),
        { ...metadataToHeaders(impressionList2DTO.metadata), SplitSDKImpressionsMode: 'DEBUG' }
      );
      expect(res).toBe(true);
    });

    test('Pop [20] Impressions divided in [2] groups of 10 Impressions with [SAME] Metadata from Storage, then make [2] Impressions POST with [10] Impressions each', async () => {
      const _mockImpressionsListWMetadata = [
        ...getImpressionsListWithSameMetadata(10, true, true),
        ...getImpressionsListWithSameMetadata(10, true, true),
      ];

      _impressionsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve((_mockImpressionsListWMetadata)));

      const res = await _impressionsSubmiter();

      expect(_impressionsCacheMock.popNWithMetadata).toBeCalledWith(1000);
      expect(_postImpressionsMock).toBeCalledTimes(2);
      // @ts-ignore
      expect(JSON.parse(_postImpressionsMock.mock.calls[0][0]).length).toEqual(10);
      // @ts-ignore
      expect(JSON.parse(_postImpressionsMock.mock.calls[1][0]).length).toEqual(10);
      expect(res).toBe(true);
    });
  });
});

