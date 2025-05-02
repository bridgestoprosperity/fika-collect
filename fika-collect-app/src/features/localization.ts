import { createSlice } from '@reduxjs/toolkit';
import { getLocales } from 'react-native-localize';

type LocaleString = string;

interface LocalizationState {
  localizationPreference: LocaleString[];
}

const systemLocales = getLocales().map(locale => locale.languageCode);

const initialState: LocalizationState = {
  localizationPreference: systemLocales,
};

export const localizationSlice = createSlice({
  name: 'localization',
  initialState,
  reducers: {
    setLocalizationPreference: (state, action) => {
      state.localizationPreference = action.payload;
    },
  },
});

export const { setLocalizationPreference } = localizationSlice.actions;

export default localizationSlice.reducer;
