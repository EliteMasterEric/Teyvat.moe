// Allow for relative imports here for simplicity.
/* eslint-disable no-restricted-imports */

import { toBase64, fromBase64 } from './base64';
import { filterNotEmpty } from './filterFunctions';
import { generateJSON, generatePrettyJSON, isValidJSON } from './json';
import { deleteRecord, getRecord, setRecord } from './record';
import {
  applySourcemapToStackTrace,
  canUseDOM,
  CloneProps,
  fromPairsToArrays,
  getApplicationVersion,
  getPreviousDailyReset,
  getPreviousMondayReset,
  getUnixTimestamp,
  getURLParams,
  hashObject,
  importFromContext,
  isDev,
  latLngToTile,
  openURLInWindow,
  reloadWindow,
  SafeHTML,
  setBrowserClipboard,
  truncateFloat,
  useDebouncedState,
} from './Util';

export {
  applySourcemapToStackTrace,
  canUseDOM,
  CloneProps,
  filterNotEmpty,
  fromBase64,
  fromPairsToArrays,
  generateJSON,
  generatePrettyJSON,
  getApplicationVersion,
  getPreviousDailyReset,
  getPreviousMondayReset,
  getUnixTimestamp,
  getURLParams,
  hashObject,
  importFromContext,
  isDev,
  isValidJSON,
  latLngToTile,
  openURLInWindow,
  getRecord,
  setRecord,
  deleteRecord,
  reloadWindow,
  SafeHTML,
  setBrowserClipboard,
  toBase64,
  truncateFloat,
  useDebouncedState,
};
