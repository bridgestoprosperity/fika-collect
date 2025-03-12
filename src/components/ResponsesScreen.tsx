import {useContext, useState, useCallback} from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import {type ReadResponse} from '../data/SurveyResponseManager';
import {type SurveyResponse} from '../data/SurveyResponse';

import {type SurveyResponseManager} from '../data/SurveyResponseManager';
import SurveyResponseManagerContext from '../data/SurveyResponseManagerContext';
import {useFocusEffect} from '@react-navigation/native';

interface ResponseProps {
  response: SurveyResponse;
  uploaded: boolean;
}

function SubmittedResponse(props: ResponseProps) {
  const {response} = props;
  return (
    <View key={response.id} style={styles.submittedResponseCard}>
      <Text style={styles.submittedResponseTitle}>{response.schema.title}</Text>
      <Text style={styles.submittedResponseDate}>
        Submitted at {response.submittedAt?.toLocaleString()}
      </Text>
    </View>
  );
}

export default function ResponsesScreen() {
  const [responses, setResponses] = useState<ReadResponse[] | null>(null);

  const responseManager = useContext<SurveyResponseManager>(
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
        setResponses(fetchedResponses);
      })
      .catch(error => {
        console.error('error fetching responses', error);
      });
  }, [responseManager, responses]);

  useFocusEffect(fetchResponses);

  return (
    <ScrollView>
      <View style={styles.container}>
        {responses === null && <Text>Loading...</Text>}
        {responses !== null && responses.length === 0 && (
          <Text style={styles.noResp}>No submitted surveys</Text>
        )}
        {responses !== null &&
          responses.length > 0 &&
          responses.map(readResponse => SubmittedResponse(readResponse))}
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
  submittedResponseCard: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
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
});
