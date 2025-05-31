import { createSlice } from '@reduxjs/toolkit';
import { getLocales } from 'react-native-localize';

type LocaleString = string;

interface LocalizationState {
  systemLocales: LocaleString[];
  localeOverride?: LocaleString | null;
  locale: LocaleString[];
}

const systemLocales = getLocales().map(locale => locale.languageCode);

const initialState: LocalizationState = {
  systemLocales: systemLocales,
  localeOverride: null,
  locale: [...systemLocales],
};

export const localizationSlice = createSlice({
  name: 'localization',
  initialState,
  reducers: {
    setSystemLocales: (state, action) => {
      state.systemLocales = action.payload;
    },
    setLocaleOverride: (state, action) => {
      state.localeOverride = action.payload;

      // Prefer locales in the order of:
      //  1. localeOverride (if set)
      //  2. system locales (in order of preference)
      //  3. 'en' (fallback)
      state.locale = [...state.systemLocales, 'en'];
      if (state.localeOverride) {
        state.locale.unshift(state.localeOverride);
      }
    }
  },
});

export const { setSystemLocales, setLocaleOverride } = localizationSlice.actions;

export default localizationSlice.reducer;
