import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ThreekitApiService } from '../../../services/threekitApiService';
import {
  ConfiguratorState,
  AttributeThreekit,
  SelectedValueThreekit,
} from './types';

const initialState: ConfiguratorState = {
  attributes: [],
  selectedConfiguration: {},
  graduationYear: '',
  shortId: null,
  isSaving: false,
  isLoading: false,
  saveError: null,
  loadError: null,
};

export const saveConfiguration = createAsyncThunk<string, void, { state: any }>(
  'configurator/saveConfiguration',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { configurator } = getState();
      const shortId = await ThreekitApiService.saveConfiguration({
        metadata: {
          attributes: configurator.attributes,
          selectedConfiguration: configurator.selectedConfiguration,
        },
      });
      const url = `${window.location.href.split('?')[0]}?tkcsid=${shortId}`;
      await navigator.clipboard.writeText(url);
      return shortId;
    } catch (e) {
      return rejectWithValue('Saving error');
    }
  }
);

export const loadConfiguration = createAsyncThunk(
  'configurator/loadConfiguration',
  async (shortId: string, { rejectWithValue }) => {
    try {
      const config = await ThreekitApiService.loadConfiguration(shortId);
      return { shortId, config };
    } catch {
      return rejectWithValue('Loading error');
    }
  }
);

const serializeValue = (value: any) => {
  // Convert Threekit Color instances to serializable format
  if (
    value &&
    typeof value === 'object' &&
    'r' in value &&
    'g' in value &&
    'b' in value
  ) {
    // Ensure it's a plain object, not a class instance
    return {
      r: Number(value.r),
      g: Number(value.g),
      b: Number(value.b),
    };
  }
  return value;
};

const buildSelected = (attrs: AttributeThreekit[]) =>
  Object.fromEntries(attrs.map((a) => [a.name, serializeValue(a.value)]));

const slice = createSlice({
  name: 'configurator',
  initialState,
  reducers: {
    setInitAttributes(state, { payload }: PayloadAction<AttributeThreekit[]>) {
      // Serialize all attributes to ensure no non-serializable values
      const serializedAttributes = payload.map((attr) => ({
        ...attr,
        defaultValue: serializeValue(attr.defaultValue),
        value: serializeValue(attr.value),
        values: attr.values?.map((val: any) =>
          typeof val === 'object' && val.value !== undefined
            ? { ...val, value: serializeValue(val.value) }
            : val
        ),
      }));

      state.attributes = serializedAttributes;
      state.selectedConfiguration = {
        ...buildSelected(serializedAttributes),
        ...state.selectedConfiguration,
      };
    },
    updateInitAttributes(
      state,
      { payload }: PayloadAction<AttributeThreekit[]>
    ) {
      state.attributes = payload;
      state.selectedConfiguration = {
        ...buildSelected(payload),
        ...state.selectedConfiguration,
      };
    },
    updateSelectedValue(
      state,
      { payload }: PayloadAction<{ name: string; value: SelectedValueThreekit }>
    ) {
      state.selectedConfiguration[payload.name] = payload.value;
    },
  },
  extraReducers: (b) =>
    b
      /* save */
      .addCase(saveConfiguration.pending, (s) => {
        s.isSaving = true;
        s.saveError = null;
      })
      .addCase(saveConfiguration.fulfilled, (s, { payload }) => {
        s.isSaving = false;
        s.shortId = payload;
      })
      .addCase(saveConfiguration.rejected, (s, { payload }) => {
        s.isSaving = false;
        s.saveError = payload as string;
      })
      /* load */
      .addCase(loadConfiguration.pending, (s) => {
        s.isLoading = true;
        s.loadError = null;
      })
      .addCase(loadConfiguration.fulfilled, (s, { payload }) => {
        s.isLoading = false;
        s.shortId = payload.shortId;
        if (payload.config?.attributes)
          s.attributes = payload.config.attributes;
        if (payload.config?.selectedConfiguration)
          s.selectedConfiguration = payload.config.selectedConfiguration;
      })
      .addCase(loadConfiguration.rejected, (s, { payload }) => {
        s.isLoading = false;
        s.loadError = payload as string;
      }),
});

export const { setInitAttributes, updateSelectedValue, updateInitAttributes } =
  slice.actions;
export default slice.reducer;
