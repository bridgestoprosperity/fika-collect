import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet, Text, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {type StackNavigation} from '../App';
import SurveySchemaManagerContext from '../data/SurveySchemaManagerContext';
import {SurveySchema} from '../data/SurveySchema';
import {SurveySchemaManager} from '../data/SurveySchemaManager';
import {SurveyResponse} from '../data/SurveyResponse';

function SurveyButton({survey}: {survey: SurveySchema}) {
  const navigation = useNavigation<StackNavigation>();

  const beginSurvey = () => {
    // Construct a single response instance. We will mutate this object as the user answers questions.
    const response = new SurveyResponse(survey);
    navigation.navigate('survey', {response});
  };

  return (
    <Pressable
      onPress={() => beginSurvey()}
      style={({pressed}) => [
        styles.surveyButton,
        pressed ? styles.surveyButtonPressed : {},
      ]}>
      <Text style={styles.surveyTitle}>{survey.title}</Text>
      <Text>{survey.description}</Text>
    </Pressable>
  );
}

export default function SurveysScreen() {
  const surveyManager = useContext<SurveySchemaManager>(
    SurveySchemaManagerContext,
  );
  const [surveys, setSurveys] = useState<SurveySchema[]>([]);

  useEffect(() => {
    surveyManager.fetchSurveys().then(() => {
      setSurveys([...surveyManager.schemas.values()]);
    });
  }, [surveyManager]);

  return (
    <ScrollView>
      <View style={styles.container}>
        {surveys.map(survey => (
          <SurveyButton key={survey.id} survey={survey} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  surveyButton: {
    borderColor: '#aaa',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    padding: 15,
    backgroundColor: 'lightgray',
    borderRadius: 4,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  surveyButtonPressed: {
    backgroundColor: 'darkgray',
  },
  surveyDescription: {},
  surveyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
