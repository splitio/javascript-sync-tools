# Custom Storage Wrapper

## Interface
The next code defines Interface that the Synchronizer's Storage configuration expects from the JS file provided to the application.

``` typescript
/**
 * Interface of a custom wrapper storage.
 */
interface ICustomStorageWrapper {

  /** Key-Value operations */

  /**
   * Get the value of given `key`.
   *
   * @function get
   * @param {string} key Item to retrieve
   * @returns {Promise<string | null>} A promise that resolves with the element value associated with the specified `key`,
   * or null if the key does not exist. The promise rejects if the operation fails.
   */
  get: (key: string) => Promise<string | null>
  /**
   * Add or update an item with a specified `key` and `value`.
   *
   * @function set
   * @param {string} key Item to update
   * @param {string} value Value to set
   * @returns {Promise<void>} A promise that resolves if the operation success, whether the key was added or updated.
   * The promise rejects if the operation fails.
   */
  set: (key: string, value: string) => Promise<void | boolean>
  /**
   * Add or update an item with a specified `key` and `value`.
   *
   * @function getAndSet
   * @param {string} key Item to update
   * @param {string} value Value to set
   * @returns {Promise<string | null>} A promise that resolves with the previous value associated to the given `key`, or null if not set.
   * The promise rejects if the operation fails.
   */
  getAndSet: (key: string, value: string) => Promise<string | null>
  /**
   * Removes the specified item by `key`.
   *
   * @function del
   * @param {string} key Item to delete
   * @returns {Promise<void>} A promise that resolves if the operation success, whether the key existed and was removed or it didn't exist.
   * The promise rejects if the operation fails, for example, if there is a connection error.
   */
  del: (key: string) => Promise<void | boolean>
  /**
   * Returns all keys matching the given prefix.
   *
   * @function getKeysByPrefix
   * @param {string} prefix String prefix to match
   * @returns {Promise<string[]>} A promise that resolves with the list of keys that match the given `prefix`.
   * The promise rejects if the operation fails.
   */
  getKeysByPrefix: (prefix: string) => Promise<string[]>
  /**
   * Returns all values which keys match the given prefix.
   *
   * @function getByPrefix
   * @param {string} prefix String prefix to match
   * @returns {Promise<string[]>} A promise that resolves with the list of values which keys match the given `prefix`.
   * The promise rejects if the operation fails.
   */
  getByPrefix: (prefix: string) => Promise<string[]>
  /**
   * Returns the values of all given `keys`.
   *
   * @function getMany
   * @param {string[]} keys List of keys to retrieve
   * @returns {Promise<(string | null)[]>} A promise that resolves with the list of items associated with the specified list of `keys`.
   * For every key that does not hold a string value or does not exist, null is returned. The promise rejects if the operation fails.
   */
  getMany: (keys: string[]) => Promise<(string | null)[]>

  /** Integer operations */

  /**
   * Increments in 1 the given `key` value or set it in 1 if the value doesn't exist.
   *
   * @function incr
   * @param {string} key Key to increment
   * @returns {Promise<void>} A promise that resolves if the operation success. The promise rejects if the operation fails,
   * for example, if there is a connection error or the key contains a string that can not be represented as integer.
   */
  incr: (key: string) => Promise<void | boolean>
  /**
   * Decrements in 1 the given `key` value or set it in -1 if the value doesn't exist.
   *
   * @function decr
   * @param {string} key Key to decrement
   * @returns {Promise<void>} A promise that resolves if the operation success. The promise rejects if the operation fails,
   * for example, if there is a connection error or the key contains a string that can not be represented as integer.
   */
  decr: (key: string) => Promise<void | boolean>

  /** Queue operations */

  /**
   * Inserts given items at the tail of `key` list. If `key` does not exist, an empty list is created before pushing the items.
   *
   * @function pushItems
   * @param {string} key List key
   * @param {string[]} items List of items to push
   * @returns {Promise<void>} A promise that resolves if the operation success.
   * The promise rejects if the operation fails, for example, if there is a connection error or the key holds a value that is not a list.
   */
  pushItems: (key: string, items: string[]) => Promise<void>
  /**
   * Removes and returns the first `count` items from a list. If `key` does not exist, an empty list is items is returned.
   *
   * @function popItems
   * @param {string} key List key
   * @param {number} count Number of items to pop
   * @returns {Promise<string[]>} A promise that resolves with the list of removed items from the list, or an empty array when key does not exist.
   * The promise rejects if the operation fails, for example, if there is a connection error or the key holds a value that is not a list.
   */
  popItems: (key: string, count: number) => Promise<string[]>
  /**
   * Returns the count of items in a list, or 0 if `key` does not exist.
   *
   * @function getItemsCount
   * @param {string} key List key
   * @returns {Promise<number>} A promise that resolves with the number of items at the `key` list, or 0 when `key` does not exist.
   * The promise rejects if the operation fails, for example, if there is a connection error or the key holds a value that is not a list.
   */
  getItemsCount: (key: string) => Promise<number>

  /** Set operations */

  /**
   * Returns if item is a member of a set.
   *
   * @function itemContains
   * @param {string} key Set key
   * @param {string} item Item value
   * @returns {Promise<boolean>} A promise that resolves with true boolean value if `item` is a member of the set stored at `key`,
   * or false if it is not a member or `key` set does not exist. The promise rejects if the operation fails, for example,
   * if there is a connection error or the key holds a value that is not a set.
   */
  itemContains: (key: string, item: string) => Promise<boolean>
  /**
   * Add the specified `items` to the set stored at `key`. Those items that are already part of the set are ignored.
   * If key does not exist, an empty set is created before adding the items.
   *
   * @function addItems
   * @param {string} key Set key
   * @param {string} items Items to add
   * @returns {Promise<void>} A promise that resolves if the operation success.
   * The promise rejects if the operation fails, for example, if there is a connection error or the key holds a value that is not a set.
   */
  addItems: (key: string, items: string[]) => Promise<void>
  /**
   * Remove the specified `items` from the set stored at `key`. Those items that are not part of the set are ignored.
   *
   * @function removeItems
   * @param {string} key Set key
   * @param {string} items Items to remove
   * @returns {Promise<void>} A promise that resolves if the operation success. If key does not exist, the promise also resolves.
   * The promise rejects if the operation fails, for example, if there is a connection error or the key holds a value that is not a set.
   */
  removeItems: (key: string, items: string[]) => Promise<void>
  /**
   * Returns all the items of the `key` set.
   *
   * @function getItems
   * @param {string} key Set key
   * @returns {Promise<string[]>} A promise that resolves with the list of items. If key does not exist, the result is an empty list.
   * The promise rejects if the operation fails, for example, if there is a connection error or the key holds a value that is not a set.
   */
  getItems: (key: string) => Promise<string[]>

  /** Control operations */

  /**
   * Connects to the underlying storage.
   * It is meant for storages that requires to be connected to some database or server. Otherwise it can just return a resolved promise.
   * Note: will be called once on SplitFactory instantiation.
   *
   * @function connect
   * @returns {Promise<void>} A promise that resolves when the wrapper successfully connect to the underlying storage.
   * The promise rejects with the corresponding error if the wrapper fails to connect.
   */
  connect: () => Promise<void>
  /**
   * Disconnects the underlying storage.
   * It is meant for storages that requires to be closed, in order to release resources. Otherwise it can just return a resolved promise.
   * Note: will be called once on SplitFactory client destroy.
   *
   * @function close
   * @returns {Promise<void>} A promise that resolves when the operation ends.
   * The promise never rejects.
   */
  close: () => Promise<void>
}
```

Another approach is to install [splitio-commons](https://github.com/splitio/javascript-commons) as dependency, import the Interface from the package and bundle the implementation into a JS file using CJS and export the instance as `default`:

``` typescript
// Using Typescript:
import { ICustomStorageWrapper } from '@splitsoftware/splitio-commons/src/storages/types';

class MyStorage implements ICustomStorageWrapper {
  get() { /* ... */ }
  set() { /* ... */ }
  /* ... */
}

export default new MyStorage();
```

Bear in mind, that the plugged Storage should be implemented considering concurrency on reading/writing data.
