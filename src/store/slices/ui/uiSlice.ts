import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from './types';

const initialState: UIState = {
  page: 'leandig',
  selectedCollection: 'all',
  sort: 'popular',
  selectedScholl: '1',
  isConfigurationLoading: false,
  selectedRing: undefined,
  depthType: {},
  dimensions: false,
  setImageUploaded: '',
  addInfo: null,
  tooltip: null,
  tooltipText: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<any>) {
      state.page = action.payload;
    },
    setConfigurationLoading(state, action: PayloadAction<boolean>) {
      state.isConfigurationLoading = action.payload;
    },
    clearAddInfo(state) {
      state.addInfo = null;
    },
    setImage(state, action: PayloadAction<{ img: string }>) {
      state.setImageUploaded = action.payload.img;
    },
  },
});

export const { setPage, setConfigurationLoading, clearAddInfo, setImage } =
  uiSlice.actions;

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
