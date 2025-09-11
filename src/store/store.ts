import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import { threekitMiddleware } from './middleware/threekitMiddleware';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(threekitMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RTKRootState = ReturnType<typeof store.getState>;
