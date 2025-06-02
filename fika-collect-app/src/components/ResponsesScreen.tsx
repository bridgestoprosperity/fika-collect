import {useContext, useState, useCallback} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
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

interface ResponseProps {
  response: SurveyResponse;
  uploaded: boolean;
  onRetry: (response: SurveyResponse) => void;
}

function SubmittedResponse(props: ResponseProps) {
  const {response, uploaded, onRetry} = props;
  const {localize} = useLocalization();

  return (
    <View key={response.id} style={styles.submittedResponseCard}>
      <View style={styles.lhs}>
        <Text style={styles.submittedResponseTitle}>
          {localize(response.schema.title)}
        </Text>
        {uploaded ? (
          <Text style={styles.submittedResponseDate}>
            Submitted at {response.submittedAt?.toLocaleString()}
          </Text>
        ) : (
          <Text style={styles.submittedResponseDate}>
            Response has not been uploaded
          </Text>
        )}
      </View>
      {!uploaded && (
        <View style={styles.rhs}>
          <Pressable
            style={({pressed}) => [
              styles.retryButton,
              pressed && styles.retryButtonPressed,
            ]}
            onPress={() => onRetry(response)}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      )}
    </View>
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

  const onRetry = useCallback(
    (response: SurveyResponse) => {
      // It seems that netInfo.isInternetReachable is not reliable, at least based on
      // testing in the iOS simulator. Instead, we will use isConnected in DEV mode
      // and isInternetReachable in production mode.
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
    [netInfo, surveyResponseManager],
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
  });

  useFocusEffect(
    useCallback(() => {
      fetchResponses();
    }, []),
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View style={styles.container}>
          {responses === null && <Text>Loading...</Text>}
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
            <Text style={styles.progressText}>Submitting...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  submittedResponseCard: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
  },
  lhs: {
    flex: 1,
  },
  rhs: {
    flex: 0,
  },
  retryButton: {
    backgroundColor: '#ee0000',
    borderRadius: 4,
  },
  retryButtonPressed: {
    backgroundColor: '#ff8888',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 700,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  submittedResponseTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  submittedResponseDate: {
    fontSize: 14,
    color: '#666',
  },
  noResp: {
    fontStyle: 'italic',
    fontSize: 18,
    color: '#666',
    marginTop: 50,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
});
