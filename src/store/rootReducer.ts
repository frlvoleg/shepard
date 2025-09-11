import { combineReducers } from '@reduxjs/toolkit';
import configuratorReducer, {
  setInitAttributes,
  updateSelectedValue,
  updateInitAttributes,
} from './slices/configurator/configuratorSlice';
import uiReducer, { uiActions } from './slices/ui/uiSlice';
import modalsReducer from './slices/modals/Modals.slice';

const configuratorActions = {
  setInitAttributes,
  updateSelectedValue,
  updateInitAttributes,
};

export const rootReducer = combineReducers({
  configurator: configuratorReducer,
  ui: uiReducer,
  modals: modalsReducer,
});

type ConfiguratorAction = ReturnType<
  (typeof configuratorActions)[keyof typeof configuratorActions]
>;
type UIAction = ReturnType<(typeof uiActions)[keyof typeof uiActions]>;
export type RootAction = ConfiguratorAction | UIAction;

export type AppStore = typeof rootReducer;
// Infer the `RootState` and `AppDispatch` types from the store itself
//@ts-ignore
export type RootState = ReturnType<AppStore['getState']>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
//@ts-ignore
export type AppDispatch = AppStore['dispatch'];
