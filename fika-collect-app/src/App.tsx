import {Text, Platform} from 'react-native';
import {createStaticNavigation, NavigationProp} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SurveysScreen from './components/SurveysScreen';
import SurveyScreen from './components/SurveyScreen';
import ResponsesScreen from './components/ResponsesScreen';
import SettingsScreen from './components/SettingsScreen';
import ConsentScreen from './components/ConsentScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {type SurveyParams} from './types.d';
import {Provider} from 'react-redux';
import {store} from './data/store';
import Geolocation from '@react-native-community/geolocation';
import {useLocalization} from './hooks/useLocalization';
import {colors, fontSize, fontWeight, spacing} from './theme';

Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'whenInUse',
  enableBackgroundLocationUpdates: false,
  locationProvider: 'auto',
});

export type ScreenNames = ['surveys', 'consent', 'responses', 'survey'];

export type RootStackParamList = {
  responses: undefined;
  survey: SurveyParams;
  consent: undefined;
  surveys: undefined;
  settings: undefined;
};

export type StackNavigation = NavigationProp<RootStackParamList>;

function LocalizedTabLabel({
  label,
  focused,
}: {
  label: string;
  focused: boolean;
}) {
  const {getString} = useLocalization();

  const ROUTE_NAME_TO_STRING: Record<string, string> = {
    surveys: 'surveysScreenTitle',
    responses: 'myResponsesScreenTitle',
    settings: 'settingsScreenTitle',
    consent: 'consentScreenTitle',
  };
  const string = ROUTE_NAME_TO_STRING[label] || label;
  const color = focused ? colors.primary : colors.textSecondary;
  const weight = focused ? fontWeight.semibold : fontWeight.normal;
  return (
    <Text style={{fontSize: fontSize.sm, color, fontWeight: weight}}>
      {getString(string)}
    </Text>
  );
}

function LocalizedHeader({label}: {label: string}) {
  const {getString} = useLocalization();

  const ROUTE_NAME_TO_STRING: Record<string, string> = {
    surveys: 'surveysScreenTitle',
    responses: 'myResponsesScreenTitle',
    settings: 'settingsScreenTitle',
    consent: 'consentScreenTitle',
  };
  const string = ROUTE_NAME_TO_STRING[label] || label;
  return (
    <Text
      style={{
        fontSize: fontSize['3xl'],
        color: colors.textInverse,
        fontWeight: fontWeight.medium,
      }}>
      {getString(string)}
    </Text>
  );
}

const HomeStack = createBottomTabNavigator({
  initialRouteName: 'surveys',
  screenOptions: ({route}) => ({
    headerShown: true,
    headerStyle: {
      backgroundColor: colors.primary,
    },
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textSecondary,
    tabBarStyle: {
      height: Platform.OS === 'ios' ? 88 : 64,
      paddingBottom: Platform.OS === 'ios' ? spacing.lg : spacing.sm,
      paddingTop: spacing.sm,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    headerTintColor: colors.textInverse,
    tabBarIcon: ({size, color}) => {
      let iconName;
      if (route.name === 'surveys') {
        iconName = '☑';
      } else if (route.name === 'responses') {
        iconName = '✎';
      } else if (route.name === 'settings') {
        iconName = '⚙';
      }
      return <Text style={{fontSize: size, color}}>{iconName}</Text>;
    },
    tabBarActiveBackgroundColor: colors.primaryLight,
    tabBarInactiveBackgroundColor: colors.surface,
    tabBarLabel: props => {
      return <LocalizedTabLabel label={route.name} focused={props.focused} />;
    },
  }),
  screens: {
    surveys: {
      screen: SurveysScreen,
      options: {
        title: 'Surveys',
        headerTitle: () => <LocalizedHeader label="surveys" />,
      },
    },
    responses: {
      screen: ResponsesScreen,
      options: {
        title: 'My Responses',
        headerTitle: () => <LocalizedHeader label="responses" />,
      },
    },
    settings: {
      screen: SettingsScreen,
      options: {
        title: 'Settings',
        headerTitle: () => <LocalizedHeader label="settings" />,
      },
    },
  },
});

const RootStack = createStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    home: {
      screen: HomeStack,
      options: {
        title: 'Home',
      },
    },
    survey: {
      screen: SurveyScreen,
      options: {
        title: 'Survey',
        presentation: 'modal',
      },
    },
    consent: {
      screen: ConsentScreen,
      options: {
        title: 'Consent',
        presentation: 'modal',
      },
    },
    settings: {
      screen: SettingsScreen,
      options: {
        title: 'Settings',
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function Home() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
