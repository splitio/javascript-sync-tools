/* eslint-disable max-len */
import { ImpressionCountsPayload } from '@splitsoftware/splitio-commons/src/sync/submitters/types';
import { impressionCountsSubmitterFactory } from '../impressionCountsSubmitter';
import { noopLogger } from './commonUtils';

describe('Impression counts submitter', () => {
  const postTestImpressionsCountMock = jest.fn(() => Promise.resolve());
  const impressionCountsCacheMock = { getImpressionsCount: jest.fn() };

  // @ts-ignore
  const impressionCountsSubmitter = impressionCountsSubmitterFactory(noopLogger, postTestImpressionsCountMock, impressionCountsCacheMock);

  beforeEach(() => {
    postTestImpressionsCountMock.mockClear();
    impressionCountsCacheMock.getImpressionsCount.mockClear();
  });

  test('If there isn\'t impression counts data, do nothing', async () => {
    impressionCountsCacheMock.getImpressionsCount = jest.fn(() => Promise.resolve());

    await impressionCountsSubmitter();

    expect(postTestImpressionsCountMock).not.toHaveBeenCalled();
    expect(impressionCountsCacheMock.getImpressionsCount).toHaveBeenCalledTimes(1);
  });

  test('If there is unique keys data, POST it', async () => {
    const expectedPayload: ImpressionCountsPayload = {
      pf: [
        { f: 'f1', m: 1, rc: 4 },
        { f: 'f2', m: 2, rc: 8 },
      ],
    };
    impressionCountsCacheMock.getImpressionsCount = jest.fn(() => Promise.resolve(expectedPayload));

    await impressionCountsSubmitter();

    expect(postTestImpressionsCountMock.mock.calls).toEqual([
      [JSON.stringify(expectedPayload)],
    ]);
    expect(impressionCountsCacheMock.getImpressionsCount).toHaveBeenCalledTimes(1);
  });

});
