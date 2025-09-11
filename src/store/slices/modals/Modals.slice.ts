import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ModalI, ModalName } from './types';

interface ModalsStateI {
  [ModalName.SAVE_CONFIGURATOR]: ModalI;
  [ModalName.CONGRATULATIONS]: ModalI;
}

const initialState: ModalsStateI = {
  [ModalName.SAVE_CONFIGURATOR]: { isOpen: false },
  [ModalName.CONGRATULATIONS]: { isOpen: false },
};

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setSaveConfiguratorModal: (state, action: PayloadAction<ModalI>) => {
      state[ModalName.SAVE_CONFIGURATOR] = action.payload;
    },
    setCongratulationModal: (state, action: PayloadAction<ModalI>) => {
      state[ModalName.CONGRATULATIONS] = action.payload;
    },
  },
});

export const { setSaveConfiguratorModal, setCongratulationModal } =
  modalsSlice.actions;

export default modalsSlice.reducer;
