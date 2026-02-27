import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  Pressable,
  Linking,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useAppDispatch, useAppSelector} from '../hooks';
import {ENGLISH_LOCALE_LABELS, LOCALE_LABELS} from 'fika-collect-survey-schema';
import {setLocaleOverride} from '../features/localization';
import {useLocalization} from '../hooks/useLocalization';
import sharedStyles from '../styles';
import {colors, spacing, fontSize, fontWeight, borderRadius} from '../theme';

export default function ResponsesScreen() {
  const dispatch = useAppDispatch();
  const selectedOverride = useAppSelector(
    state => state.localization.localeOverride,
  );
  const {getString} = useLocalization();

  const availableLocales = Object.keys(LOCALE_LABELS);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.scrollView}>
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
                dropdownIconRippleColor={colors.border}
                dropdownIconColor={colors.text}
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
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeaderText}>Delete my data</Text>

              <Text style={styles.sectionBody}>
                To request deletion of your data, please submit the form below.
              </Text>
              <Pressable
                style={({pressed}) => [
                  styles.dangerButton,
                  pressed && styles.dangerButtonPressed,
                ]}
                onPress={() => {
                  Linking.openURL('https://forms.gle/ZswVZ7mXEQtNeGbz6');
                }}>
                <Text style={styles.dangerButtonText}>Delete my data</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  section: {
    width: '100%',
  },
  sectionHeaderContainer: {
    width: '100%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeaderText: {
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  sectionBody: {
    fontSize: fontSize.base,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  dangerButton: {
    backgroundColor: colors.error,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  dangerButtonPressed: {
    backgroundColor: colors.errorPressed,
  },
  dangerButtonText: {
    color: colors.textInverse,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
});
