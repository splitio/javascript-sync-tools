/* eslint-disable no-magic-numbers */
import { eventsSubmitterFactory } from '../synchroniserEventsSubmitter';
import { Response } from 'node-fetch';

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

  // test1: pop & send.
  test('Pop events from Storage and post to Split\'s services', async () => {
    // eslint-disable-next-line max-len
    const _eventsMock = '[{"m":{"s":"go-6.1.0","i":"192.168.0.6","n":"ip-192-168-0-6"},"e":{"key":"emi","trafficTypeName":"user","eventTypeId":"event","value":5,"timestamp":1621273519949}},{"m":{"s":"go-6.1.0","i":"192.168.0.6","n":"ip-192-168-0-6"},"e":{"key":"emi","trafficTypeName":"user","eventTypeId":"event","value":5,"timestamp":1621273529961}}]';
    _eventsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve(JSON.parse(_eventsMock)));
    const res = await _eventsSubmitter();

    expect(_eventsCacheMock.popNWithMetadata).toBeCalledWith(1000);
    expect(_postEventsMock).toBeCalledWith(_eventsMock);
    expect(res).toBe(true);
  });

  // test2: pop, process and split by metadata group, send.
  test('Pop events from Storage, Process and separate by Metadata in 2 calls to POST events.', async () => {
    // eslint-disable-next-line max-len
    const _eventsMock = '[{"m":{"s":"go-6.1.0","i":"192.168.0.6","n":"ip-192-168-0-6"},"e":{"key":"emi","trafficTypeName":"user","eventTypeId":"event","value":5,"timestamp":1621273519949}},{"m":{"s":"go-6.1.0","i":"192.168.0.6","n":"ip-192-168-0-6"},"e":{"key":"emi","trafficTypeName":"user","eventTypeId":"event","value":5,"timestamp":1621273529961}},{"m":{"s":"go-6.1.0","i":"192.168.0.6","n":"ip-192-168-0-6"},"e":{"key":"emi","trafficTypeName":"user","eventTypeId":"event","value":5,"timestamp":1621273539976}},{"m":{"s":"go-6.1.0","i":"1.2.3.4","n":"ip-192-168-0-6"},"e":{"key":"emi","trafficTypeName":"user","eventTypeId":"event","value":5,"timestamp":1621273562186}},{"m":{"s":"go-6.1.0","i":"1.2.3.4","n":"ip-192-168-0-6"},"e":{"key":"emi","trafficTypeName":"user","eventTypeId":"event","value":5,"timestamp":1621273572201}}]';
    _eventsCacheMock.popNWithMetadata.mockReturnValue(Promise.resolve(JSON.parse(_eventsMock)));
    const res = await _eventsSubmitter();

    expect(_eventsCacheMock.popNWithMetadata).toBeCalledWith(1000);
    // eslint-disable-next-line max-len
    expect(_postEventsMock).toHaveBeenNthCalledWith(1, '[{"m":{"s":"go-6.1.0","i":"192.168.0.6","n":"ip-192-168-0-6"},"e":{"key":"emi","trafficTypeName":"user","eventTypeId":"event","value":5,"timestamp":1621273519949}},{"m":{"s":"go-6.1.0","i":"192.168.0.6","n":"ip-192-168-0-6"},"e":{"key":"emi","trafficTypeName":"user","eventTypeId":"event","value":5,"timestamp":1621273529961}},{"m":{"s":"go-6.1.0","i":"192.168.0.6","n":"ip-192-168-0-6"},"e":{"key":"emi","trafficTypeName":"user","eventTypeId":"event","value":5,"timestamp":1621273539976}}]');
    // eslint-disable-next-line max-len
    expect(_postEventsMock).toHaveBeenNthCalledWith(2, '[{"m":{"s":"go-6.1.0","i":"1.2.3.4","n":"ip-192-168-0-6"},"e":{"key":"emi","trafficTypeName":"user","eventTypeId":"event","value":5,"timestamp":1621273562186}},{"m":{"s":"go-6.1.0","i":"1.2.3.4","n":"ip-192-168-0-6"},"e":{"key":"emi","trafficTypeName":"user","eventTypeId":"event","value":5,"timestamp":1621273572201}}]');
    expect(res).toBe(true);
  });
  // test3: pop, process, split by group, split by size, send.
});
