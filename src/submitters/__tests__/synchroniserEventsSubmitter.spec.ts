/* eslint-disable max-len, no-magic-numbers */
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
    _eventsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve((_eventsMock)));

    const res = await _eventsSubmitter();

    expect(_eventsCacheMock.popNWithMetadata).toBeCalledWith(1000);
    expect(_postEventsMock).toBeCalledWith(JSON.stringify(_eventsMock));
    expect(res).toBe(true);
  });

  test(
    'Pop 5 events from Storage, process and split them by METADATA in 2 calls, then make an Events POST.',
    async () => {
      const _eventsMock1 = getMultipleEventsSameMetadata(3, false, true);
      const _eventsMock2 = getMultipleEventsSameMetadata(2, false, true);
      _eventsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve([..._eventsMock1, ..._eventsMock2]));

      const res = await _eventsSubmitter();

      expect(_eventsCacheMock.popNWithMetadata).toBeCalledWith(1000);
      expect(_postEventsMock).toHaveBeenNthCalledWith(1, JSON.stringify(_eventsMock1));
      expect(_postEventsMock).toHaveBeenNthCalledWith(2, JSON.stringify(_eventsMock2));
      expect(res).toBe(true);
    }
  );

  test(
    'Pop 6 events from Storage, process and split them by MAX SIZE batches in 2 calls, then make an Events POST.',
    async () => {
      const _eventsMock = getMultipleEventsSameMetadata(6, true);
      _eventsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve(_eventsMock));

      const res = await _eventsSubmitter();

      expect(_eventsCacheMock.popNWithMetadata).toBeCalledWith(1000);
      expect(_postEventsMock).toHaveBeenNthCalledWith(1, JSON.stringify(_eventsMock.slice(0, 5)));
      expect(_postEventsMock).toHaveBeenNthCalledWith(2, JSON.stringify(_eventsMock.slice(5, 6)));
      expect(res).toBe(true);
    }
  );

  test('Pop 46 events from Storage, process and split them by METADATA and MAX SIZE batches in 10 calls, then make an Events Post.',
    async () => {
      const _eventsMock = [
        ...getMultipleEventsSameMetadata(6, false, true),
        ...getMultipleEventsSameMetadata(8, false, true),
        ...getMultipleEventsSameMetadata(16, true, true),
        ...getMultipleEventsSameMetadata(16, true, true),
      ];

      _eventsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve(_eventsMock));
      await _eventsSubmitter();

      expect(_postEventsMock).toBeCalledTimes(10);
    });
});
