/* eslint-disable no-magic-numbers, max-len, jsdoc/require-jsdoc*/
import { ImpressionCountsCacheInMemory } from '@splitsoftware/splitio-commons/src/storages/inMemory/ImpressionCountsCacheInMemory';
import { impressionsSubmitterFactory, impressionWithMetadataToImpressionDTO } from '../synchronizerImpressionsSubmitter';
import { getImpressionsListWithSameMetadata } from './impressionsMockUtils';
import { impressionObserverSSFactory } from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/impressionObserverSS';
import { impressionsCountSubmitterFactory } from '../synchronizerImpressionsCountSubmitter';
import { metadataToHeaders } from '../utils';
import { truncateTimeFrame } from '@splitsoftware/splitio-commons/src/utils/time';
import { ImpressionObserver } from '@splitsoftware/splitio-commons/src/trackers/impressionObserver/ImpressionObserver';

describe('Impressions Submitter for Lightweight Synchronizer', () => {
  const _postImpressionsMock = jest.fn(() => Promise.resolve());
  const _impressionsCacheMock = {
    popNWithMetadata: jest.fn(),
    count: jest.fn().mockImplementation(() => 0),
  };
  const _fakeLogger = { error: () => { } };

  let observer: ImpressionObserver;
  let countsCache: ImpressionCountsCacheInMemory;
  let _impressionsSubmiter: { (): any; (): Promise<string | boolean>; };

  beforeEach(() => {
    _postImpressionsMock.mockClear();
    _impressionsCacheMock.popNWithMetadata.mockClear();
    _impressionsCacheMock.count.mockClear();

    countsCache = new ImpressionCountsCacheInMemory();
    observer = impressionObserverSSFactory();
  });

  describe('Impressions Submitter, with [OPTIMIZED] mode set in settings', () => {
    beforeEach(() => {
      _impressionsSubmiter = impressionsSubmitterFactory(
        // @ts-ignore
        _postImpressionsMock,
        _impressionsCacheMock,
        observer,
        undefined,
        undefined,
        undefined,
        countsCache,
      );
    });

    test(`Pop [0] Impressions from Storage,
      then make [0] Impressions POST,
      then make [0] Impressions Count POST`, async () => {
      _impressionsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve(([])));

      const res = await _impressionsSubmiter();

      expect(_impressionsCacheMock.popNWithMetadata).toBeCalledWith(1000);
      expect(_postImpressionsMock).toBeCalledTimes(0);
      expect(res).toBe(true);

      // Test Impressions Count
      const _postImpressionsCountMock = jest.fn(() => Promise.resolve());
      // @ts-ignore
      const _impressionsCountSubmitter = impressionsCountSubmitterFactory(_postImpressionsCountMock, countsCache);

      await _impressionsCountSubmitter();

      expect(countsCache.isEmpty()).toBe(true);
      expect(_postImpressionsCountMock).toBeCalledTimes(0);
    });

    test(`Pop [2] Impressions with [SAME] Metadata from Storage,
      then make [1] Impressions POST with [1] Impressions,
      then make an Impressions Count POST with [1] Impression, with its count value at [2]`, async () => {
      const _mockImpressionsListWMetadata = getImpressionsListWithSameMetadata(2, true);
      const _mockImpressionToDTO = impressionWithMetadataToImpressionDTO(_mockImpressionsListWMetadata[0]);
      _impressionsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve((_mockImpressionsListWMetadata)));

      const res = await _impressionsSubmiter();

      expect(_impressionsCacheMock.popNWithMetadata).toBeCalledWith(1000);
      expect(_postImpressionsMock).toBeCalledWith(
        JSON.stringify([{
          f: impressionWithMetadataToImpressionDTO(_mockImpressionsListWMetadata[0]).impression.feature,
          i: [impressionWithMetadataToImpressionDTO(_mockImpressionsListWMetadata[0]).impression],
        }]),
        { ...metadataToHeaders(_mockImpressionToDTO.metadata), SplitSDKImpressionsMode: 'OPTIMIZED' }
      );
      expect(res).toBe(true);

      // Test Impressions Count
      const _postImpressionsCountMock = jest.fn(() => Promise.resolve());
      // @ts-ignore
      const _impressionsCountSubmitter = impressionsCountSubmitterFactory(_postImpressionsCountMock, countsCache);

      await _impressionsCountSubmitter();

      expect(countsCache.isEmpty()).toBe(true);
      expect(_postImpressionsCountMock).toHaveBeenNthCalledWith(
        1,
        JSON.stringify({
          pf: [
            { f: _mockImpressionToDTO.impression.feature, m: truncateTimeFrame(Date.now()), rc: 2 },
          ],
        }),
      );
    });

    test(`Pop [2] Impressions with [DIFFERENT] Metadata from Storage,
      then make [2] Impressions POST with [2] Impressions
      then make an Impressions Count POST with [2] different Impressions, each count value at [1]`, async () => {
      const _mockImpressionsListWMetadata = [
        ...getImpressionsListWithSameMetadata(1, true, true),
        ...getImpressionsListWithSameMetadata(1, true, true),
      ];
      const impression1DTO = impressionWithMetadataToImpressionDTO(_mockImpressionsListWMetadata[0]);
      const impression2DTO = impressionWithMetadataToImpressionDTO(_mockImpressionsListWMetadata[1]);

      _impressionsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve((_mockImpressionsListWMetadata)));

      const res = await _impressionsSubmiter();

      expect(_impressionsCacheMock.popNWithMetadata).toBeCalledWith(1000);
      expect(_postImpressionsMock).toHaveBeenNthCalledWith(
        1,
        JSON.stringify([{
          f: impression1DTO.impression.feature,
          i: [
            impression1DTO.impression,
          ],
        }]),
        { ...metadataToHeaders(impression1DTO.metadata), SplitSDKImpressionsMode: 'OPTIMIZED' }
      );
      expect(_postImpressionsMock).toHaveBeenNthCalledWith(
        2,
        JSON.stringify([{
          f: impression2DTO.impression.feature,
          i: [
            impression2DTO.impression,
          ],
        }]),
        { ...metadataToHeaders(impression2DTO.metadata), SplitSDKImpressionsMode: 'OPTIMIZED' }
      );
      expect(_postImpressionsMock).toBeCalledTimes(2);

      expect(res).toBe(true);

      // Test Impressions Count
      const _postImpressionsCountMock = jest.fn(() => Promise.resolve());
      // @ts-ignore
      const _impressionsCountSubmitter = impressionsCountSubmitterFactory(_postImpressionsCountMock, countsCache);

      await _impressionsCountSubmitter();
      const impression1Data = impression1DTO.impression;
      const impression2Data = impression2DTO.impression;

      expect(countsCache.isEmpty()).toBe(true);
      expect(_postImpressionsCountMock).toHaveBeenNthCalledWith(
        1,
        JSON.stringify({
          pf: [
            { f: impression1Data.feature, m: truncateTimeFrame(Date.now()), rc: 1 },
            { f: impression2Data.feature, m: truncateTimeFrame(Date.now()), rc: 1 },
          ],
        }),
      );
    });

    test(`Pop [20] Impressions, divided in [2] groups of 10 Impressions with [SAME] Metadata from Storage,
      then make [2] Impressions POST with [1] Impressions each
      then make an Impressions Count POST with [2] different Impressions, each count value at [10]`, async () => {
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
        JSON.stringify([{
          f: impressionList1DTO[0].impression.feature,
          i: [impressionList1DTO[0].impression],
        }]),
        { ...metadataToHeaders(impressionList1DTO[0].metadata), SplitSDKImpressionsMode: 'OPTIMIZED' }
      );
      expect(_postImpressionsMock).toHaveBeenNthCalledWith(
        2,
        JSON.stringify([{
          f: impressionList2DTO[0].impression.feature,
          i: [impressionList2DTO[0].impression],
        }]),
        { ...metadataToHeaders(impressionList2DTO[0].metadata), SplitSDKImpressionsMode: 'OPTIMIZED' }
      );
      // @ts-ignore
      expect(JSON.parse(_postImpressionsMock.mock.calls[0][0]).length).toEqual(1);
      // @ts-ignore
      expect(JSON.parse(_postImpressionsMock.mock.calls[1][0]).length).toEqual(1);
      expect(res).toBe(true);

      // Test Impressions Count
      const _postImpressionsCountMock = jest.fn(() => Promise.resolve());
      // @ts-ignore
      const _impressionsCountSubmitter = impressionsCountSubmitterFactory(_postImpressionsCountMock, countsCache);

      await _impressionsCountSubmitter();
      const impression1Data = impressionList1DTO[0].impression;
      const impression2Data = impressionList2DTO[0].impression;

      expect(countsCache.isEmpty()).toBe(true);
      expect(_postImpressionsCountMock).toHaveBeenNthCalledWith(
        1,
        JSON.stringify({
          pf: [
            { f: impression1Data.feature, m: truncateTimeFrame(Date.now()), rc: 10 },
            { f: impression2Data.feature, m: truncateTimeFrame(Date.now()), rc: 10 },
          ],
        }),
      );
    });

  });

  describe('Impressions Submitter, with [DEBUG] mode set in settings', () => {
    beforeEach(() => {
      _impressionsSubmiter = impressionsSubmitterFactory(
        // @ts-ignore
        _postImpressionsMock,
        _impressionsCacheMock,
        observer,
        undefined,
        undefined,
        undefined,
        undefined,
      );
    });
    test(`Pop [2] Impressions with [SAME] metadata from Storage,
          then make [1] Impressions POST with [2] impressions each`, async () => {
      const _mockImpressionsListWMetadata = getImpressionsListWithSameMetadata(2, true);
      const _mockImpressionsListToDTO = _mockImpressionsListWMetadata.map(i => impressionWithMetadataToImpressionDTO(i));
      _impressionsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve((_mockImpressionsListWMetadata)));

      const res = await _impressionsSubmiter();

      expect(_impressionsCacheMock.popNWithMetadata).toBeCalledWith(1000);
      // The reason we are parsing the object and validating its keys (and its according value type) is because
      // the `pt` key only exists in some impressions (that are repeated), and comparing the stringigy version
      // of the parameter in the call and the expected stringify value is not going to work.
      // @ts-ignore
      const call = JSON.parse(_postImpressionsMock.mock.calls[0][0]);

      expect(call[0]).toEqual(
        expect.objectContaining({
          f: expect.any(String),
          i: expect.any(Array),
        })
      );

      expect(call[0].i.pop()).toEqual(
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

    test(`Pop [2] Impressions with [DIFFERENT] metadata from Storage,
          then make [2] Impressions POST with [1] impression each`, async () => {
      const _mockImpressionsListWMetadata = [
        ...getImpressionsListWithSameMetadata(1, true, true),
        ...getImpressionsListWithSameMetadata(1, true, true),
      ];
      const impression1DTO = impressionWithMetadataToImpressionDTO(_mockImpressionsListWMetadata[0]);
      const impression2DTO = impressionWithMetadataToImpressionDTO(_mockImpressionsListWMetadata[1]);

      _impressionsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve((_mockImpressionsListWMetadata)));

      const res = await _impressionsSubmiter();

      expect(_impressionsCacheMock.popNWithMetadata).toBeCalledWith(1000);
      expect(_postImpressionsMock).toHaveBeenNthCalledWith(
        1,
        JSON.stringify([{
          f: impression1DTO.impression.feature,
          i: [impression1DTO.impression],
        }]),
        { ...metadataToHeaders(impression1DTO.metadata), SplitSDKImpressionsMode: 'DEBUG' }
      );
      expect(_postImpressionsMock).toHaveBeenNthCalledWith(
        2,
        JSON.stringify([{
          f: impression2DTO.impression.feature,
          i: [impression2DTO.impression],
        }]),
        { ...metadataToHeaders(impression2DTO.metadata), SplitSDKImpressionsMode: 'DEBUG' }
      );
      expect(res).toBe(true);
    });

    test(`Pop [20] Impressions divided in [2] groups of 10 Impressions with [SAME] Metadata from Storage,
          then make [2] Impressions POST with [10] Impressions each`, async () => {
      const _mockImpressionsListWMetadata = [
        ...getImpressionsListWithSameMetadata(10, true, true),
        ...getImpressionsListWithSameMetadata(10, true, true),
      ];

      _impressionsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve((_mockImpressionsListWMetadata)));

      const res = await _impressionsSubmiter();

      expect(_impressionsCacheMock.popNWithMetadata).toBeCalledWith(1000);
      expect(_postImpressionsMock).toBeCalledTimes(2);
      // @ts-ignore
      expect(JSON.parse(_postImpressionsMock.mock.calls[0][0]).length).toEqual(1);
      // @ts-ignore
      expect(JSON.parse(_postImpressionsMock.mock.calls[1][0]).length).toEqual(1);
      expect(res).toBe(true);
    });
  });

  describe('Impressions Submitter with custom configs and fail scenarios', () => {
    test('Multiple runs [2] times, until storage count is 0', async () => {
      // @ts-ignore
      _impressionsSubmiter = impressionsSubmitterFactory(
        // @ts-ignore
        _postImpressionsMock,
        _impressionsCacheMock,
        observer,
      );

      _impressionsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve([]));
      _impressionsCacheMock.count
        .mockReturnValueOnce(Promise.resolve(3))
        .mockReturnValue(Promise.resolve(0));

      const res = await _impressionsSubmiter();

      expect(_impressionsCacheMock.popNWithMetadata).toBeCalledTimes(2);
      expect(res).toBe(true);
    });

    test('Run PopFromStorage with parameter value [33]', async () => {
      const IMPRESSIONS_PER_POST = 33;

      _impressionsSubmiter = impressionsSubmitterFactory(
        // @ts-ignore
        _postImpressionsMock,
        _impressionsCacheMock,
        observer,
        undefined,
        IMPRESSIONS_PER_POST,
        undefined,
        undefined,
      );
      const _mockImpressionsListWMetadata = getImpressionsListWithSameMetadata(2, true);
      _impressionsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve((_mockImpressionsListWMetadata)));

      await _impressionsSubmiter();

      expect(_impressionsCacheMock.popNWithMetadata).toBeCalledWith(IMPRESSIONS_PER_POST);
    });

    test('Abort Sync tasks after all [5] set retries attempts fail', async () => {
      const MAX_RETRIES = 5;
      const _failPostImpressionsMock = jest.fn(() => Promise.reject());

      let _impressionsSubmiterToFail = impressionsSubmitterFactory(
        // @ts-ignore
        _failPostImpressionsMock,
        // @ts-ignore
        _impressionsCacheMock,
        observer,
        _fakeLogger,
        undefined,
        MAX_RETRIES,
        undefined,
      );
      const _mockImpressionsListWMetadata = getImpressionsListWithSameMetadata(2, true);
      _impressionsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve((_mockImpressionsListWMetadata)));

      const res = await _impressionsSubmiterToFail();

      expect(_impressionsCacheMock.popNWithMetadata).toBeCalledWith(1000);
      expect(_failPostImpressionsMock).toBeCalledTimes(5);
      expect(res).toBe(false);
    });
  });
});

