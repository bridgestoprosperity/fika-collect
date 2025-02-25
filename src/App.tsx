import * as React from 'react';
import {createStaticNavigation, NavigationProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './components/HomeScreen';
import SurveyScreen from './components/SurveyScreen';
import {SurveyParams} from './types.d';

export type ScreenNames = ['home', 'survey'];
export type RootStackParamList = {
  home: undefined;
  survey: SurveyParams;
};

export type StackNavigation = NavigationProp<RootStackParamList>;

const RootStack = createNativeStackNavigator({
  initialRouteName: 'home',
  screenOptions: {
    headerStyle: {
      backgroundColor: '#367845',
    },
    headerTitleStyle: {
      color: 'white',
    },
    headerTintColor: 'white',
  },
  screens: {
    home: {
      screen: HomeScreen,
      options: {
        title: 'Surveys',
      },
    },
    survey: {
      screen: SurveyScreen,
      options: {
        title: 'Survey',
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
