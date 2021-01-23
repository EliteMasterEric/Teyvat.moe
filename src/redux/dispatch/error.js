import store from '~/redux';

import { displayImportError as displayImportErrorCreator } from '~/redux/ducks/error';

export const displayImportError = (errorString) => {
  store.dispatch(displayImportErrorCreator(errorString));
};
