import {View, ScrollView, StyleSheet, SafeAreaView, Button} from 'react-native';
import Markdown from '@ronradtke/react-native-markdown-display';
import {useAppDispatch} from '../hooks';
import {assignRandomUserId} from '../features/userInfo';
import {useNavigation} from '@react-navigation/native';

const copy = `# App Disclosure - Fika Collect

Fika collect helps users report transportation barriers - places where travel is unsafe or difficult.
Your reports help [Bridges to Prosperity](https://bridgestoprosperity.org/) and local government/infrastructure
partners identify and plan solutions.

Information will be stored securely online in the United States or another location with adequate data protection standards.

This app is not designed for children under 16. If you are under 16, please only use this pap with the supervision
and permission of a parent or guardian.

**Data requiring your consent:**

- GPS location of the barrier
- Photos of the barrier
- Your phone number (for possible follow-up)

Sharing this information is optional, but without it, you won't be able to submit reports through the app.

**Do you agree to share this information?**
`;

export default function ConsentScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const agree = () => {
    dispatch(assignRandomUserId());
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <Markdown>{copy}</Markdown>
        </View>
        <View style={styles.btnContainer}>
          <Button
            title="I Agree"
            onPress={() => {
              agree();
              navigation.goBack();
              // Handle consent agreement logic here
            }}
            color="#367845"
          />
          <Button
            title="I Do Not Agree"
            onPress={() => {
              // Handle consent denial logic here
            }}
            color="#d9534f"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 20,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
});
