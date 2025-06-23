import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  Appearance,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useAppDispatch, useAppSelector} from '../hooks';
import {ENGLISH_LOCALE_LABELS, LOCALE_LABELS} from 'fika-collect-survey-schema';
import {setLocaleOverride} from '../features/localization';
import {useLocalization} from '../hooks/useLocalization';
import sharedStyles from '../styles';

const isLightTheme = Appearance.getColorScheme() === 'light';

export default function ResponsesScreen() {
  const dispatch = useAppDispatch();
  const selectedOverride = useAppSelector(
    state => state.localization.localeOverride,
  );
  const {getString} = useLocalization();

  const availableLocales = Object.keys(LOCALE_LABELS);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeaderText}>
                {getString('preferredLanguage')}
              </Text>
              <Picker
                selectedValue={selectedOverride || 'default'}
                style={sharedStyles.picker}
                itemStyle={sharedStyles.pickerItem}
                dropdownIconRippleColor={isLightTheme ? '#ccc' : '#444'}
                dropdownIconColor={isLightTheme ? '#000' : '#fff'}
                onValueChange={itemValue =>
                  dispatch(
                    setLocaleOverride(
                      itemValue === 'default' ? null : itemValue,
                    ),
                  )
                }>
                <Picker.Item
                  label="Default (System Language)"
                  value="default"
                />
                {availableLocales.map(locale => (
                  <Picker.Item
                    key={locale}
                    label={`${LOCALE_LABELS[locale]} (${ENGLISH_LOCALE_LABELS[locale]})`}
                    value={locale}
                  />
                ))}
              </Picker>
            </View>
          </View>
          {
            '' /*
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeaderText}>User Information</Text>
            </View>
          </View>*/
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  section: {
    width: '100%',
  },
  sectionHeaderContainer: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 30,
  },
  sectionHeaderText: {
    textTransform: 'uppercase',
    marginBottom: 10,
  },
});
