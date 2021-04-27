import { setImportError } from './Actions';
import { dispatchAction } from 'src/components/redux/Dispatch';
import { LocalizedString } from 'src/components/Types';

/**
 * Set the import error to display in the "Import Data" popups.
 * This is done because I don't think toasts are visible from inside popups.
 * TODO: Check this.
 * @param {LocalizedString} value The string to display.
 *  This is a LocalizedString to encourage forcing the string to be localized rather than hardcoded.
 */
export const dispatchSetImportError = (value: LocalizedString): void => {
  dispatchAction(setImportError(value));
};
