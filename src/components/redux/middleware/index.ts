import { ConfigureStoreOptions } from '@reduxjs/toolkit';

import editorCategoryMiddleware from 'src/components/redux/middleware/editorCategory';
import { AppState } from 'src/components/redux/types';
import initializationMiddleware from 'src/components/redux/middleware/initialization';

const fullMiddleware: ConfigureStoreOptions<AppState>['middleware'] = (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(editorCategoryMiddleware).concat(initializationMiddleware);

export default fullMiddleware;
