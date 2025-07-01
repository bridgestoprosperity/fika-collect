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

//import {useContext, useEffect} from 'react';
//import SurveyResponseManagerContext from './data/SurveyResponseManagerContext';
//import {useNetInfo} from '@react-native-community/netinfo';

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
  const color = focused ? '#367845' : '#888';
  const fontWeight = focused ? 'bold' : 'normal';
  return (
    <Text style={{fontSize: 16, color, fontWeight}}>{getString(string)}</Text>
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
    <Text style={{fontSize: 24, color: 'white', fontWeight: 500}}>
      {getString(string)}
    </Text>
  );
}

const HomeStack = createBottomTabNavigator({
  initialRouteName: 'surveys',
  screenOptions: ({route}) => ({
    headerShown: true,
    headerStyle: {
      backgroundColor: '#367845',
    },
    tabBarActiveTintColor: '#367845',
    tabBarStyle: {
      height: Platform.OS === 'ios' ? 92 : 65,
    },
    headerTintColor: 'white',
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
    tabBarActiveBackgroundColor: '#e0f2e0',
    tabBarInactiveBackgroundColor: 'white',
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
  /*
  const responseManager = useContext(SurveyResponseManagerContext);
  const netInfo = useNetInfo();
  useEffect(() => {
    if (!netInfo.isInternetReachable) {
      return;
    }
    responseManager.uploadResponses();
  }, [responseManager, netInfo.isInternetReachable]);
  */

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
