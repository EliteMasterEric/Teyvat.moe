// It gets added to window.
import _ from 'lodash';
import { mapStackTrace } from 'sourcemapped-stacktrace';

let development: boolean | null = null;
/**
 * Determines whether the current page is running in a development environment,
 * or a production environment.
 * @returns {boolean} If the page is in a dev environment such as localhost.
 */
export const isDevelopment = (): boolean => {
  // Cache the result.
  if (development != null) return development;

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    console.debug('Running in development environment (LOCAL).');
    development = true;
  } else if (process.env.BRANCH && process.env.BRANCH === 'develop') {
    console.debug('Running in development environment (NETLIFY).');
    development = true;
  } else {
    console.debug('Running in production.');
    console.debug(process.env);
    development = false;
  }

  return development;
};

/**
 * Applies a sourcemap to a given stack trace.
 * @param stackTrace The stack trace to parse.
 * @returns A Promise to parse the stack trace asynchronously.
 */
export const applySourcemapToStackTrace = (stackTrace: string): Promise<string> => {
  return new Promise((resolve, _reject) => {
    mapStackTrace(
      stackTrace,
      (mappedStack) => {
        const joinedStack = mappedStack.join('\n');
        resolve(joinedStack);
      },
      {
        filter: _.constant(true),
      }
    );
  });
};
