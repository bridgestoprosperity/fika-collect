import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Text,
} from 'react-native';
import Markdown from '@ronradtke/react-native-markdown-display';
import {useAppDispatch} from '../hooks';
import {postConsent} from '../features/userInfo';
import {useNavigation} from '@react-navigation/native';
import {colors, spacing, fontSize, fontWeight, borderRadius} from '../theme';

const terms = `# App Disclosure - Fika Collect

Fika collect helps users report transportation barriers - places where travel is unsafe or difficult.
Your reports help [Fika](https://fika.org/) and local government/infrastructure
partners identify and plan solutions.

Information will be stored securely online in the United States or another location with adequate data protection standards.
This app is not designed for children under 16. If you are under 16, please only use this app with the supervision and permission of a parent or guardian.

Information collected:
GPS location of the barrier
- Photo of the barrier
- Your phone number (for possible follow-up)

Submitting this information is voluntary, but required if you want to use this application. By submitting a survey via this app, you acknowledge that this information will be used for infrastructure planning purposes.


**Do you agree to share this information?**`;

const markdownStyles = {
  body: {
    color: colors.text,
    fontSize: fontSize.base,
    lineHeight: 24,
  },
  heading1: {
    color: colors.text,
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    marginBottom: spacing.md,
  },
  paragraph: {
    marginBottom: spacing.md,
  },
  link: {
    color: colors.link,
  },
  strong: {
    fontWeight: fontWeight.semibold,
  },
  bullet_list: {
    marginBottom: spacing.md,
  },
  list_item: {
    marginBottom: spacing.xs,
  },
};

export default function ConsentScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const agree = () => {
    dispatch(postConsent({consentText: terms}));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <View style={styles.container}>
          <Markdown style={markdownStyles}>{terms}</Markdown>
        </View>
        <View style={styles.btnContainer}>
          <Pressable
            onPress={() => {
              agree();
              navigation.goBack();
            }}
            style={({pressed}) => [
              styles.agreeButton,
              pressed && styles.agreeButtonPressed,
            ]}>
            <Text style={styles.agreeButtonText}>I Agree</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: spacing.md,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  agreeButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  agreeButtonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  agreeButtonText: {
    color: colors.textInverse,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
});
