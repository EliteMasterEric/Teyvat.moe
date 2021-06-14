/**
 * Retrieve the current Unix timestamp, in seconds.
 * @returns A Unix timestamp, in seconds.
 */
export const getUnixTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};
