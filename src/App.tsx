import * as React from 'react';
import {Text} from 'react-native';
import {createStaticNavigation, NavigationProp} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SurveysScreen from './components/SurveysScreen';
import SurveyScreen from './components/SurveyScreen';
import ResponsesScreen from './components/ResponsesScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {type SurveyParams} from './types.d';

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
    },
    headerTintColor: 'white',
    tabBarIcon: ({size}) => {
      let iconName;
      if (route.name === 'surveys') {
        iconName = '☑';
      } else if (route.name === 'responses') {
        iconName = '✎';
      }
      return <Text style={{fontSize: size}}>{iconName}</Text>;
    },
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
        headerLeft: () => null, // Hide the back button
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function Home() {
  return <Navigation />;
}
