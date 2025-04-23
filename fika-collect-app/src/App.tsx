import {Text} from 'react-native';
import {createStaticNavigation, NavigationProp} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SurveysScreen from './components/SurveysScreen';
import SurveyScreen from './components/SurveyScreen';
import ResponsesScreen from './components/ResponsesScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {type SurveyParams} from './types.d';
import {Provider} from 'react-redux';
import {store} from './data/store';
import Geolocation from '@react-native-community/geolocation';

//import {useContext, useEffect} from 'react';
//import SurveyResponseManagerContext from './data/SurveyResponseManagerContext';
//import {useNetInfo} from '@react-native-community/netinfo';

Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'whenInUse',
  enableBackgroundLocationUpdates: false,
  locationProvider: 'auto',
});

export type ScreenNames = ['surveys', 'responses', 'survey'];

export type RootStackParamList = {
  responses: undefined;
  survey: SurveyParams;
  surveys: undefined;
};

export type StackNavigation = NavigationProp<RootStackParamList>;

const HomeStack = createBottomTabNavigator({
  initialRouteName: 'surveys',
  screenOptions: ({route}) => ({
    headerShown: true,
    headerStyle: {
      backgroundColor: '#367845',
    },
    headerTitleStyle: {
      color: 'white',
      fontSize: 22,
    },
    headerTintColor: 'white',
    tabBarIcon: ({size, color}) => {
      let iconName;
      if (route.name === 'surveys') {
        iconName = '☑';
      } else if (route.name === 'responses') {
        iconName = '✎';
      }
      return <Text style={{fontSize: size, color}}>{iconName}</Text>;
    },
    tabBarLabelStyle: {
      fontSize: 14, // Increase the font size of the tab label
    },
    tabBarActiveTintColor: '#367845',
    tabBarInactiveTintColor: '#888',
  }),
  screens: {
    surveys: {
      screen: SurveysScreen,
      options: {
        title: 'Surveys',
      },
    },
    responses: {
      screen: ResponsesScreen,
      options: {
        title: 'My Responses',
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
