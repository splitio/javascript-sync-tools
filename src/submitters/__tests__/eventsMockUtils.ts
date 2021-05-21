/* eslint-disable no-magic-numbers, jsdoc/require-jsdoc */
export const singleEventMaxSize = {
  'm':{
    's':'go-6.1.0',
    'i':'192.168.0.6',
    'n':'ip-192-168-0-6',
  },
  'e': {
    'key':'joe',
    'trafficTypeName':
    'user','eventTypeId':
    'event',
    'value':5,
    'properties':{
      'a':`${Array(841).join('x')}`,
    },
    'timestamp':1621273519949,
  },
};

export function getSingleEventMaxSizeString() {
  return JSON.stringify(singleEventMaxSize);
}
