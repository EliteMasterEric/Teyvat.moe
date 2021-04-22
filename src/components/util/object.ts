// eslint-disable-next-line @typescript-eslint/ban-types
export const getKeys = Object.keys as <T extends object>(object: T) => Array<keyof T>;
