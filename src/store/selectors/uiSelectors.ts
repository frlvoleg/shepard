import { RootState } from '../rootReducer';

export const selectUI = (state: RootState) => state.ui;
export const getSelectedPage = (state: RootState) => state.ui.page;
export const getImageUploaded = (state: RootState) => state.ui.setImageUploaded;
export const getSelectedRing = (state: RootState) => state.ui.selectedRing;
