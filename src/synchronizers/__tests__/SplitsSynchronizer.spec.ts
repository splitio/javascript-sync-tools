// @ts-nocheck
import { ISplit } from '@splitsoftware/splitio-commons/src/dtos/types';
import { SplitsSynchronizer } from '../SplitsSynchronizer';

describe('Splits Synchronizer', () => {
  const _splitFetcherMock = jest.fn(() => Promise.resolve({
    ok: true,
    status: 200,
    json: Promise.resolve,
  }));
  const _settingsMock = {
    log: { error: () => { } },
    scheduler: { impressionsQueueSize: 100 },
    sync: { __splitFiltersValidation: false },
    core: { key: undefined },
  };

  const _splitStorageMock = (() => {
    const _splitsStored = [
      { name: 'pepito1', changeNumber: 0 },
      { name: 'pepito2', changeNumber: 0 },
    ];
    let _changeNumber = 1;

    return {
      update: jest.fn((toAdd: ISplit[], toRemove, n) => {
        toAdd.map(s => _splitsStored.push(s));
        _changeNumber = n;
      }),
      getSplitNames: jest.fn(() => Promise.resolve(_splitsStored.map(s => s.name))),
      getAll: jest.fn(() => _splitsStored),
      getSplit: jest.fn((name) => Promise.resolve(_splitsStored.find(s => s.name === name))),
      getChangeNumber: jest.fn(() => _changeNumber),
    };
  })();

  const _segmentsStorageMock = (() => {
    let _registeredSegments = ['aSegment'];
    return {
      registerSegments: jest.fn((segments) => {
        segments.map(s => _registeredSegments.push(s));
        _registeredSegments = Array.from(new Set(_registeredSegments));
      }),
      getRegisteredSegments: jest.fn(() => _registeredSegments),
    };
  })();

  let _splitsSynchronizer;

  const createNewSynchronizer = () => {
    _splitsSynchronizer = new SplitsSynchronizer(
      _splitFetcherMock,
      _settingsMock,
      {
        splits: _splitStorageMock,
        segments: _segmentsStorageMock,
      }
    );
  };

  describe('Synchronize Splits using [InMemoryOperation] mode', () => {
    describe('Get data from Storage.', () => {
      beforeAll(async () => {
        createNewSynchronizer();
        await _splitsSynchronizer.getDataFromStorage();
      });

      test('retrieves [SPLITS] stored from Storage into InMemory cache', () => {
        const splitsNames = _splitsSynchronizer._inMemoryStorage.splits
          .getAll()
          .map((split) => split.name);

        expect(splitsNames).toEqual(['pepito1', 'pepito2']);
        expect(_splitsSynchronizer._inMemoryStorage.splits.getChangeNumber()).toBe(1);
      });

      test('retrieves [SEGMENTS] stored from Storage into InMemory cache', () => {
        expect(_splitsSynchronizer._inMemoryStorage.segments.getRegisteredSegments()).toEqual(['aSegment']);
      });
    });

    describe('Process differences between data previous to Sync and new data.', () => {
      beforeAll(() => {
        createNewSynchronizer();
        _splitsSynchronizer._inMemoryStorageSnapshot.splits.update([{ name: 'pepito1', changeNumber: 4 }], [], 4);
        _splitsSynchronizer._inMemoryStorageSnapshot.splits.update([{ name: 'pepito2', changeNumber: 4 }], [], 4);
        _splitsSynchronizer._inMemoryStorage.splits.update([{ name: 'pepito2', changeNumber: 5 }], [], 5);
        _splitsSynchronizer._inMemoryStorage.splits.update([{ name: 'pepito3', changeNumber: 3 }], [], 3);
      });

      test('compares the updated InMemory cache with previous snapshot and removes [1] unused split', async () => {
        const result = await _splitsSynchronizer.processDifferences();

        expect(result).toBe(1);
      });
    });

    describe('Put data from InMemory Cache to storage - After synchronization occurred', () => {
      beforeAll(async () => {
        createNewSynchronizer();
        // adding some data simulating synchronization execution')
        _splitsSynchronizer._inMemoryStorage.splits.update([{ name: 'pepito3', changeNumber: 6 }], [], 12);

        _splitsSynchronizer._inMemoryStorage.segments.registerSegments(['anotherSegment']);

        await _splitsSynchronizer.putDataToStorage();
      });

      test('has stored [SPLITS] data from InMemory cache to Storage.', async () => {
        expect(await _splitStorageMock.getSplitNames()).toStrictEqual(['pepito1', 'pepito2', 'pepito3']);
        expect(await _splitStorageMock.getChangeNumber()).toBe(12);
      });

      test('has stored [SEGMENTS] data from InMemory cache to Storage', async () => {
        expect(await _segmentsStorageMock.getRegisteredSegments()).toEqual(['aSegment', 'anotherSegment']);
      });
    });
  });
});
