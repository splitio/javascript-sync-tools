import { StoredEventWithMetadata } from '@splitsoftware/splitio-commons/src/sync/submitters/types';
import { _getRandomString } from './commonUtils';

/**
 * Mock representing an Event String with no Properties object.
 */
export const singleEventMockNoProperties = `{
  "m":{
    "s":"go-6.1.0",
    "i":"192.168.0.6",
    "n":"ip-192-168-0-6"
  },
  "e": {
    "key":"joe",
    "trafficTypeName":
    "user","eventTypeId":
    "event",
    "value":5,
    "timestamp":1621273519949
  }
}`;
/**
 * Function that returns a single Mock Event, with the option to randomize some of its data.
 *
 * @param isSetMaxSize - Flag to decide to randomize some of the Metadata.
 * @param randomize - Flag to decide to randomize some of the Metadata.
 */
export function getSingleEventString(isSetMaxSize = false, randomize = false): string {
  const _newEvent = JSON.parse(singleEventMockNoProperties);
  // Randomize metadata.name parameter.
  if (randomize) {
    _newEvent.m.n = _getRandomString(14);
  }
  // Add Properties object with a string value to reach 1024 bytes size for event limit.
  if (isSetMaxSize) {
    _newEvent.properties = Object.assign({}, { a: Array(841).join('X') });
  }

  return JSON.stringify(_newEvent);
}
/**
 * Function to return a list with a specific number of Events with the same metadata, with the option of generating
 * the events set with Max Size per event cap, or randomize metadata.
 *
 * @param amount - The amount of events to add and return in the list.
 * @param isSetMaxSize - The flag to define if the events are set to its Max Size.
 * @param randomize - The flag to set the same random metadata for the events in the list.
 */
export function getMultipleEventsSameMetadata(
  amount: number,
  isSetMaxSize: boolean = false,
  randomize: boolean = false
): StoredEventWithMetadata[] {
  const _singleEvent = getSingleEventString(isSetMaxSize, randomize);
  const _eventsList: StoredEventWithMetadata[] = [];

  for (let i = 0; i < amount; i++) {
    _eventsList.push(JSON.parse(_singleEvent));
  }

  return _eventsList;
}
