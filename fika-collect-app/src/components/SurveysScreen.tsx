import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import {useLocalization} from '../hooks/useLocalization';
import {useNavigation} from '@react-navigation/native';
import {type StackNavigation} from '../App';
import SurveySchemaManagerContext from '../data/SurveySchemaManagerContext';
import type {Survey} from 'fika-collect-survey-schema';
import {SurveySchemaManager} from '../data/SurveySchemaManager';
import {SurveyResponse} from '../data/SurveyResponse';
import Announcements from './Announcements';
import {useAppSelector} from '../hooks';
import {AnimatedCard} from './ui';
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
} from '../theme';

function SurveyButton({survey}: {survey: Survey}) {
  const navigation = useNavigation<StackNavigation>();
  const {localize} = useLocalization();

  const userId = useAppSelector(state => state.userInfo.userId);
  const termsAccepted = useAppSelector(state => state.userInfo.termsAccepted);

  const beginSurvey = () => {
    const response = new SurveyResponse(survey, userId);
    navigation.navigate('survey', {response});
  };

  useEffect(() => {
    if (termsAccepted) {
      return;
    }
    navigation.navigate('consent');
  }, [navigation, termsAccepted]);

  return (
    <AnimatedCard onPress={beginSurvey} style={styles.surveyButton}>
      <View style={styles.surveyContent}>
        <Text style={styles.surveyTitle}>{localize(survey.title)}</Text>
        <Text style={styles.surveyDescription}>
          {localize(survey.description)}
        </Text>
      </View>
      <View style={styles.chevronContainer}>
        <Text style={styles.chevron}>›</Text>
      </View>
    </AnimatedCard>
  );
}

export default function SurveysScreen() {
  const surveyManager = useContext<SurveySchemaManager>(
    SurveySchemaManagerContext,
  );
  const [surveys, setSurveys] = useState<Survey[]>([
    ...surveyManager.schemas.values(),
  ]);

  useEffect(() => {
    surveyManager.fetchSurveys().then(() => {
      setSurveys([...surveyManager.schemas.values()]);
    });
  }, [surveyManager]);

  return (
    <ScrollView style={styles.scrollView}>
      <Announcements />
      <View style={styles.container}>
        {surveys.map(survey => (
          <SurveyButton key={survey.id} survey={survey} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  surveyButton: {
    flexDirection: 'row',
    marginBottom: spacing.sm + 4,
    width: '100%',
  },
  surveyContent: {
    flex: 1,
  },
  surveyTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
    color: colors.text,
  },
  surveyDescription: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  chevronContainer: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: spacing.sm,
  },
  chevron: {
    fontSize: 28,
    fontWeight: fontWeight.normal,
    color: colors.textHint,
  },
});
