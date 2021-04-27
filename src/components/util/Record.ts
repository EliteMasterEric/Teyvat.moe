/**
 * This module contains utility functions for handling interactions
 */

/**
 * Retrieve a key/value pair from a record.
 * @param record The record
 */
// By using this complex type we get a dynamic return type.
// If a default value is not specified, the function can return null.
type getRecordType = {
  <T extends string | number | symbol, R extends unknown>(
    record: Record<T, R> | null,
    key: T
  ): R | null;
  <T extends string | number | symbol, R extends unknown>(
    record: Record<T, R>,
    key: T,
    defaultValue: R
  ): R;
};
export const getRecord: getRecordType = <T extends string | number | symbol, R extends unknown>(
  record: Record<T, R> | null,
  key: T,
  defaultValue: R | null = null
) => {
  return record?.[key] ?? defaultValue;
};

/**
 * Insert a key/value pair into a record.
 * @param record The record to set the value in.
 * @param key The key to insert.
 * @param value The value to insert.
 */
export const setRecord = <T extends string | number | symbol, R extends unknown>(
  record: Record<T, R>,
  key: T,
  value: R
): void => {
  record[key] = value;
};

/**
 * Delete a key/value pair from a record.
 * @param record The record to delete the key from.
 * @param key The key to delete.
 * @returns The value of the deleted key.
 */
export const deleteRecord = <T extends string | number | symbol, R extends unknown>(
  record: Record<T, R>,
  key: T
): R | undefined => {
  const value = record?.[key];
  delete record[key];
  return value;
};
