import { ConfigureStoreOptions } from '@reduxjs/toolkit';

import { AppState } from '~/components/redux/types';

import editorCategoryMiddleware from '~/components/redux/middleware/editorCategory';

const fullMiddleware: ConfigureStoreOptions<AppState>['middleware'] = (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(editorCategoryMiddleware);

export default fullMiddleware;
