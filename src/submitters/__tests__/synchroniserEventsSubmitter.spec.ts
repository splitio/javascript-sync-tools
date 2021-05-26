/* eslint-disable max-len, no-magic-numbers */
import { metadataToHeaders } from '../metadataUtils';
import { eventsSubmitterFactory } from '../synchroniserEventsSubmitter';
import { getMultipleEventsSameMetadata } from './eventsMockUtils';

describe('Events Submitter for Lightweight Synchroniser', () => {
  const _postEventsMock = jest.fn(() => Promise.resolve());
  const _eventsCacheMock = {
    popNWithMetadata: jest.fn(),
  };

  // @ts-ignore
  const _eventsSubmitter = eventsSubmitterFactory(_postEventsMock, _eventsCacheMock);

  afterEach(() => {
    _postEventsMock.mockClear();
    _eventsCacheMock.popNWithMetadata.mockClear();
  });

  test('Pop 3 events from Storage and make an Events POST', async () => {
    const _eventsMock = getMultipleEventsSameMetadata(3);
    const _metadata = metadataToHeaders(_eventsMock[0].m);
    const _eventsList = _eventsMock.map(i => i.e);
    _eventsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve((_eventsMock)));

    const res = await _eventsSubmitter();

    expect(_eventsCacheMock.popNWithMetadata).toBeCalledWith(1000);
    expect(_postEventsMock).toBeCalledWith(JSON.stringify(_eventsList), _metadata);
    expect(res).toBe(true);
  });

  test(
    'Pop 5 events from Storage, process and split them by METADATA in 2 calls, then make an Events POST.',
    async () => {
      const _eventsMock1 = getMultipleEventsSameMetadata(3, false, true);
      const _metadata1 = metadataToHeaders(_eventsMock1[0].m);
      const _eventsMock2 = getMultipleEventsSameMetadata(2, false, true);
      const _metadata2 = metadataToHeaders(_eventsMock2[0].m);
      _eventsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve([..._eventsMock1, ..._eventsMock2]));

      const res = await _eventsSubmitter();

      expect(_eventsCacheMock.popNWithMetadata).toBeCalledWith(1000);
      expect(_postEventsMock).toHaveBeenNthCalledWith(1, JSON.stringify(_eventsMock1.map(i => i.e)), _metadata1);
      expect(_postEventsMock).toHaveBeenNthCalledWith(2, JSON.stringify(_eventsMock2.map(i => i.e)), _metadata2);
      expect(res).toBe(true);
    }
  );

  test(
    'Pop 6 events from Storage, process and split them by MAX SIZE batches in 2 calls, then make an Events POST.',
    async () => {
      const _eventsMock = getMultipleEventsSameMetadata(10000, true);
      _eventsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve(_eventsMock));

      const res = await _eventsSubmitter();

      expect(_eventsCacheMock.popNWithMetadata).toBeCalledWith(1000);
      expect(_postEventsMock).toBeCalledTimes(2);
      expect(res).toBe(true);
    }
  );

  test('Pop 46 events from Storage, process and split them by METADATA and MAX SIZE batches in 10 calls, then make an Events Post.',
    async () => {
      const _eventsMock = [
        ...getMultipleEventsSameMetadata(10000, false, true),
        ...getMultipleEventsSameMetadata(10000, false, true),
        ...getMultipleEventsSameMetadata(10000, true, true),
        ...getMultipleEventsSameMetadata(10000, true, true),
      ];

      _eventsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve(_eventsMock));
      await _eventsSubmitter();

      expect(_postEventsMock).toBeCalledTimes(6);
    });
});
