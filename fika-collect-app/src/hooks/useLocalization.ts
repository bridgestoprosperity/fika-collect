import { useSelector } from 'react-redux';

interface Localization {
  [key: string]: string;
}

function useLocalization() {
  const preferredLanguages = useSelector(
    (state: any) => state.localization.localizationPreference,
  );

  return (value: Localization | string): string => {
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
}

export { useLocalization };
