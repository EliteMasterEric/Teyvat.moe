import { ConfigureStoreOptions } from '@reduxjs/toolkit';

import editorCategoryMiddleware from 'src/components/redux/middleware/EditorCategory';
import initializationMiddleware from 'src/components/redux/middleware/Loading';
import { AppState } from 'src/components/redux/Types';

const fullMiddleware: ConfigureStoreOptions<AppState>['middleware'] = (getDefaultMiddleware) => [
  ...getDefaultMiddleware(),
  editorCategoryMiddleware,
  initializationMiddleware,
];

export default fullMiddleware;
