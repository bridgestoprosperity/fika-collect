import {useContext, useState, useCallback} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  SafeAreaView,
} from 'react-native';
import {type ReadResponse} from '../data/SurveyResponseManager';
import {type SurveyResponse} from '../data/SurveyResponse';

import {type SurveyResponseManager} from '../data/SurveyResponseManager';
import SurveyResponseManagerContext from '../data/SurveyResponseManagerContext';
import {useFocusEffect} from '@react-navigation/native';
import {useNetInfo} from '@react-native-community/netinfo';
import {useLocalization} from '../hooks/useLocalization';
import {AnimatedButton, AnimatedCard, LoadingSpinner} from './ui';
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  shadows,
} from '../theme';

interface ResponseProps {
  response: SurveyResponse;
  uploaded: boolean;
  onRetry: (response: SurveyResponse) => void;
}

function SubmittedResponse(props: ResponseProps) {
  const {response, uploaded, onRetry} = props;
  const {localize} = useLocalization();

  return (
    <AnimatedCard style={styles.submittedResponseCard}>
      <View style={styles.lhs}>
        <Text style={styles.submittedResponseTitle}>
          {localize(response.schema.title)}
        </Text>
        {uploaded ? (
          <Text style={styles.submittedResponseDate}>
            Submitted at {response.submittedAt?.toLocaleString()}
          </Text>
        ) : (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>Pending upload</Text>
          </View>
        )}
      </View>
      {!uploaded && (
        <View style={styles.rhs}>
          <AnimatedButton
            title="Retry"
            variant="danger"
            onPress={() => onRetry(response)}
          />
        </View>
      )}
    </AnimatedCard>
  );
}

export default function ResponsesScreen() {
  const [responses, setResponses] = useState<ReadResponse[] | null>(null);

  const responseManager = useContext<SurveyResponseManager>(
    SurveyResponseManagerContext,
  );

  const netInfo = useNetInfo();
  const [submitting, setSubmitting] = useState(false);
  const surveyResponseManager = useContext<SurveyResponseManager>(
    SurveyResponseManagerContext,
  );

  const fetchResponses = useCallback(() => {
    responseManager
      .getResponses()
      .then(fetchedResponses => {
        const fetchedIds = fetchedResponses.map(item => item.response.id);
        const currentIds = responses
          ? responses.map(item => item.response.id)
          : null;
        if (JSON.stringify(currentIds) === JSON.stringify(fetchedIds)) {
          return;
        }
        const sortedResponses = fetchedResponses.sort((a, b) => {
          if (a.uploaded === b.uploaded) {
            return 0;
          }
          return a.uploaded ? 1 : -1;
        });
        setResponses(sortedResponses);
      })
      .catch(error => {
        console.error('error fetching responses', error);
      });
  }, [responseManager, responses]);

  const onRetry = useCallback(
    (response: SurveyResponse) => {
      if (
        netInfo.isInternetReachable ||
        (__DEV__ === true && netInfo.isConnected)
      ) {
        setSubmitting(true);
      } else {
        Alert.alert(
          'No internet connection',
          'Your response is still saved locally. Please try again when you have an internet connection.',
        );
        return;
      }
      surveyResponseManager
        .uploadResponse(response)
        .then(() => {
          response.uploaded = true;
          setSubmitting(false);
          fetchResponses();
          Alert.alert('Survey response submitted successfully!');
        })
        .catch(error => {
          console.error(error);
          setSubmitting(false);
          Alert.alert(
            'Error submitting survey',
            'Your response is still saved locally. Please try again later.',
          );
        });
    },
    [netInfo, surveyResponseManager, fetchResponses],
  );

  useFocusEffect(
    useCallback(() => {
      fetchResponses();
    }, [fetchResponses]),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {responses === null && (
            <Text style={styles.loadingText}>Loading...</Text>
          )}
          {responses !== null && responses.length === 0 && (
            <Text style={styles.noResp}>No submitted surveys</Text>
          )}
          {responses !== null &&
            responses.length > 0 &&
            responses.map(readResponse => (
              <SubmittedResponse
                key={readResponse.response.id}
                response={readResponse.response}
                uploaded={readResponse.uploaded}
                onRetry={response => onRetry(response)}
              />
            ))}
        </View>
      </ScrollView>
      {submitting && (
        <View style={styles.overlay}>
          <View style={styles.progressContainer}>
            <LoadingSpinner size={40} />
            <Text style={styles.progressText}>Submitting...</Text>
          </View>
        </View>
      )}
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
  submittedResponseCard: {
    flexDirection: 'row',
    marginBottom: spacing.sm + 4,
    width: '100%',
  },
  lhs: {
    flex: 1,
  },
  rhs: {
    flex: 0,
    justifyContent: 'center',
  },
  submittedResponseTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs,
    color: colors.text,
  },
  submittedResponseDate: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  pendingBadge: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  pendingBadgeText: {
    fontSize: fontSize.xs,
    color: colors.warning,
    fontWeight: fontWeight.medium,
  },
  noResp: {
    fontStyle: 'italic',
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginTop: spacing['2xl'],
  },
  loadingText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing.xl,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 100,
    ...shadows.lg,
  },
  progressText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
    color: colors.text,
  },
});
