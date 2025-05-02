import React from 'react';
import {Text, TextProps} from 'react-native';
import {useSelector} from 'react-redux';

interface Localization {
  [key: string]: string;
}

interface I18nTextProps extends TextProps {
  value: Localization | string;
}

function localize(
  value: Localization | string,
  preferredLanguages: string[],
): string {
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
}

const LocalizedText: React.FC<I18nTextProps> = ({value, ...props}) => {
  const preferredLanguages = useSelector(
    (state: any) => state.localization.localizationPreference,
  );

  let localizedText = localize(value, preferredLanguages);

  return <Text {...props}>{localizedText}</Text>;
};

export {LocalizedText};
