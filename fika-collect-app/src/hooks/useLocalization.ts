import { useSelector } from 'react-redux';
import type { Localization } from '../localizations';
import { localizations } from '../localizations';

function useLocalization() {
  const preferredLanguages = useSelector(
    (state: any) => state.localization.localizationPreference,
  );

  function localize(value: Localization | string): string {
    if (typeof value === 'string') {
      return value;
    } else {
      let localizedText = value.en || '';
      for (const lang of preferredLanguages) {
        if (value[lang]) {
          localizedText = value[lang];
          break;
        }
      }
      return localizedText;
    }
  };

  function getString(key: string): string {
    const localizedStrings = localizations[key] || {};
    let localizedText = localizedStrings.en || '';
    for (const lang of preferredLanguages) {
      if (localizedStrings[lang]) {
        localizedText = localizedStrings[lang];
        break;
      }
    }
    if (!localizedText) {
      if (process.env.NODE_ENV === 'development') {
        throw new Error(`Missing localization for key: ${key}`);
      }
      return `{${key}}`;
    }

    return localizedText;
  }

  return { localize, getString };
}

export { useLocalization };
