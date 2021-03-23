import { ConfigureStoreOptions } from '@reduxjs/toolkit';

import editorCategoryMiddleware from 'src/components/redux/middleware/editorCategory';
import { AppState } from 'src/components/redux/types';

const fullMiddleware: ConfigureStoreOptions<AppState>['middleware'] = (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(editorCategoryMiddleware);

export default fullMiddleware;
