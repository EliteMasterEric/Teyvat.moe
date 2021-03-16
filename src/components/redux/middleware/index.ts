import { ConfigureStoreOptions } from '@reduxjs/toolkit';

import editorCategoryMiddleware from '~/components/redux/middleware/editorCategory';
import { AppState } from '~/components/redux/types';

const fullMiddleware: ConfigureStoreOptions<AppState>['middleware'] = (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(editorCategoryMiddleware);

export default fullMiddleware;
