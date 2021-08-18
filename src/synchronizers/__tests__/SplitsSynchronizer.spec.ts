/* eslint-disable no-magic-numbers, jsdoc/require-jsdoc */
// @ts-nocheck
import { SplitsSynchronizer } from '../SplitsSynchronizer';

describe('Splits Synchronizer', () => {
  const _splitFetcherMock = jest.fn(() => Promise.resolve({
    ok: true,
    status: 200,
    json: Promise.resolve,
  }));
  const _settingsMock = { log: { error: () => {} } };

  const _splitsInMemoryCache = () => {
    const _splitsCache = [];
    let _changeNumber;
    return {
      addSplits: jest.fn((splitList: [string, string][]) => {
        splitList.forEach((keyValueTuple) => {
          _splitsCache.push(keyValueTuple);
        });
      }),
      getSplitNames: jest.fn(() => _splitsCache.map(i => i[0])),
      getSplit: jest.fn((name) => _splitsCache.find(i => i[0] === name)[1]),
      setChangeNumber: jest.fn((number) => _changeNumber = number),
      getChangeNumber: jest.fn(() => _changeNumber),
      getAll: jest.fn(() => _splitsCache),
    };
  };

  const _splitStorageMock = ( () => {
    const _splitsStored = { pepito1: 'splitDefinition1', pepito2: 'splitDefinition2' };
    let _changeNumber = 10;

    return {
      addSplits: jest.fn((list) => {
        list.map((tuple) => _splitsStored[tuple[0]] = tuple[1]);
      }),
      getSplitNames: jest.fn(() => Promise.resolve(Object.keys(_splitsStored))),
      getSplit: jest.fn((name) => Promise.resolve(_splitsStored[name])),
      setChangeNumber: jest.fn((n) => _changeNumber = n),
      getChangeNumber: jest.fn(() => _changeNumber),
    };
  })();

  const _segmentsInMemoryCache = () => {
    let _segmentsCache = [];

    return {
      registerSegments: jest.fn((segments) => segments.map(s => _segmentsCache.push(s))),
      getRegisteredSegments: jest.fn(() => _segmentsCache),
    };
  };

  const _segmentsStorageMock = (() => {
    let _registeredSegments = ['aSegment'];
    return {
      registerSegments: jest.fn((segments) => {
        segments.map(s => _registeredSegments.push(s));
        _registeredSegments =  Array.from(new Set(_registeredSegments));
      }),
      getRegisteredSegments: jest.fn(() => _registeredSegments),
    };
  })();

  const _inMemoryStorageMock = {
    splits: _splitsInMemoryCache(),
    segments: _segmentsInMemoryCache(),
  };

  const _splitsSynchronizer = new SplitsSynchronizer(
    _splitFetcherMock,
    // @ts-ignore
    _settingsMock,
    _splitStorageMock,
    _segmentsStorageMock,
    _inMemoryStorageMock,
  );

  describe('Synchronize Splits using [InMemoryOperation] mode', () => {
    beforeAll(async () => {
      await _splitsSynchronizer.getDataFromStorage();
    });

    it('retrieves [SPLITS] stored from Storage into InMemory cache', () => {
      expect(_inMemoryStorageMock.splits.getAll()).toEqual([
        ['pepito1', 'splitDefinition1'],
        ['pepito2', 'splitDefinition2'],
      ]);

      expect(_inMemoryStorageMock.splits.getChangeNumber()).toBe(10);
    });

    it('retrieves [SEGMENTS] stored from Storage into InMemory cache', () => {
      expect(_inMemoryStorageMock.segments.getRegisteredSegments()).toEqual(['aSegment']);
    });

    describe('After Synchronization occured', () => {
      beforeAll(async () => {
        // adding some data simulating Synchronization execution')
        _inMemoryStorageMock.splits.addSplits([['pepito3', 'splitDefinition3']]);
        _inMemoryStorageMock.splits.setChangeNumber(12);
        _inMemoryStorageMock.segments.registerSegments(['anotherSegment']);

        await _splitsSynchronizer.putDataToStorage();
      });

      it('has stored [SPLITS] data from InMemory cache to Storage.', async () => {
        expect(await _splitStorageMock.getSplitNames()).toStrictEqual(['pepito1', 'pepito2', 'pepito3']);
        expect(await _splitStorageMock.getChangeNumber()).toBe(12);
      });

      it('has stored [SEGMENTS] data from InMemory cache to Storage', async () => {
        expect(await _segmentsStorageMock.getRegisteredSegments()).toEqual(['aSegment', 'anotherSegment']);
      });
    });
  });
});
