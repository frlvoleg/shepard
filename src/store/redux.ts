import { useStore, useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from './rootReducer';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = (selector: (state: RootState) => any) =>
  useSelector(selector);
export const useAppStore = () => useStore<RootState>();
