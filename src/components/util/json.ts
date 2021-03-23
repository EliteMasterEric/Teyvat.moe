/**
 * Checks whether the input string is a valid JSON blob.
 * @returns True if valid and false if invalid.
 */
export const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const jsonReplacer = (_key: string, value: any) => {
  if (value instanceof Error) {
    const error: { [key: string]: any } = {};

    Object.getOwnPropertyNames(value).forEach((key) => {
      error[key] = value[key as keyof Error];
    });

    return error;
  }

  return value;
};

/**
 * Generate JSON of an object.
 * Includes handling for undefined types such as Error.
 *
 * @param input The object to convert.
 * @returns A JSON string representing the object.
 */
export const generateJSON = (input: unknown): string => {
  return JSON.stringify(input, jsonReplacer);
};

/**
 * Generate prettified JSON of an object, with spaces and line breaks.
 * Includes handling for undefined types such as Error.
 *
 * @param input The object to convert.
 * @returns Prettified JSON, with spacing and newlines.
 */
export const generatePrettyJSON = (input: unknown): string => {
  return JSON.stringify(input, jsonReplacer, 2);
};
