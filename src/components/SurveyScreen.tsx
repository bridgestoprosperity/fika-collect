import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Switch,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {type SurveyParams} from '../types.d';
import {SurveyQuestionResponse} from '../data/SurveyResponse';
import {useNavigation} from '@react-navigation/native';

type SurveyScreenProps = {
  route: {params: SurveyParams};
};

interface SurveyQuestionProps {
  response: SurveyQuestionResponse;
  onChange: (value: string) => void;
}

function ShortAnswerQuestion({response, onChange}: SurveyQuestionProps) {
  const {question} = response;

  return (
    <View style={styles.surveyQuestion}>
      <Text style={styles.surveyQuestionText}>{question.question}</Text>
      <TextInput
        style={styles.textInputBox}
        value={response.value}
        onChangeText={text => onChange(text)}
        placeholder={question.hint}
      />
    </View>
  );
}

function LongAnswerQuestion({response, onChange}: SurveyQuestionProps) {
  const {question} = response;
  console.log(question.hint);
  return (
    <View style={styles.surveyQuestion}>
      <Text style={styles.surveyQuestionText}>{question.question}</Text>
      <TextInput
        style={styles.multiLineTextInputBox}
        multiline
        value={response.value}
        onChangeText={text => onChange(text)}
        placeholder={question.hint}
        placeholderTextColor={'#666'}
      />
    </View>
  );
}

function BooleanQuestion({response, onChange}: SurveyQuestionProps) {
  const {question} = response;
  const placeholder = question.hint;

  return (
    <View style={styles.surveyQuestion}>
      <Text style={styles.surveyQuestionText}>{question.question}</Text>

      <View style={styles.booleanRow}>
        <Switch
          value={response.value === 'yes'}
          onValueChange={value => onChange(value ? 'yes' : 'no')}
        />
        <Text style={styles.booleanValue}>
          {response.value === 'yes' ? 'Yes' : 'No'}
        </Text>
      </View>
      {placeholder ? (
        <View style={{marginTop: 40}}>
          <Text style={styles.hint}>{placeholder}</Text>
        </View>
      ) : null}
    </View>
  );
}

function MultipleChoiceQuestion({response, onChange}: SurveyQuestionProps) {
  const {question} = response;

  return (
    <View style={styles.surveyQuestion}>
      <Text style={styles.surveyQuestionText}>{question.question}</Text>
      <Picker
        itemStyle={styles.picker}
        selectedValue={response.value}
        onValueChange={value => onChange(value)}>
        {question.options.map(option => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>
    </View>
  );
}

function LocationQuestion({response}: SurveyQuestionProps) {
  const {question} = response;

  return (
    <View style={styles.surveyQuestion}>
      <Text style={styles.surveyQuestionText}>{question.question}</Text>
    </View>
  );
}

function PhotosQuestion({response}: SurveyQuestionProps) {
  const {question} = response;

  return (
    <View style={styles.surveyQuestion}>
      <Text style={styles.surveyQuestionText}>{question.question}</Text>
    </View>
  );
}

function SurveyQuestion({response, onChange}: SurveyQuestionProps) {
  const {question} = response;
  switch (question.type) {
    case 'boolean':
      return <BooleanQuestion response={response} onChange={onChange} />;
    case 'short_answer':
      return <ShortAnswerQuestion response={response} onChange={onChange} />;
    case 'long_answer':
      return <LongAnswerQuestion response={response} onChange={onChange} />;
    case 'multiple_choice':
      return <MultipleChoiceQuestion response={response} onChange={onChange} />;
    case 'location':
      return <LocationQuestion response={response} onChange={onChange} />;
    case 'photos':
      return <PhotosQuestion response={response} onChange={onChange} />;
    default:
      return null;
  }
}

export default function SurveyScreen(props: SurveyScreenProps) {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [revision, setRevision] = React.useState(0);

  const {
    route: {
      params: {response},
    },
  } = props;

  const schema = response.schema;
  const questionCount = schema.questions.length;
  const currentResponse = response.responses[questionIndex];
  const canContinue = currentResponse.hasResponse;

  const next = () => {
    if (!canContinue) {
      return;
    }
    setQuestionIndex(questionIndex + 1);
  };

  const prev = () => {
    if (questionIndex === 0) {
      Alert.alert(
        'Discard response',
        'Are you sure you want to discard this survey response?',
        [
          {
            text: 'Cancel',
            onPress: () => setQuestionIndex(questionIndex),
            style: 'cancel',
          },
          {
            text: 'Discard',
            onPress: () => navigation.goBack(),
            style: 'destructive',
          },
        ],
        {
          cancelable: true,
          onDismiss: () =>
            Alert.alert(
              'This alert was dismissed by tapping outside of the alert dialog.',
            ),
        },
      );
    } else {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const continueBtnStyle = canContinue
    ? styles.submitButton
    : styles.submitButtonDisabled;

  const navigation = useNavigation();

  const setResponse = (value: string) => {
    currentResponse.value = value;
    setRevision(revision + 1);
  };

  const submit = () => {
    console.log('submit!');
    Alert.alert(
      'Submit response',
      'Are you sure you want to submit this survey response?',
      [
        {
          text: 'Cancel',
          onPress: () => setQuestionIndex(questionIndex),
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: () => navigation.goBack(),
          style: 'destructive',
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            'This alert was dismissed by tapping outside of the alert dialog.',
          ),
      },
    );
  };

  return (
    <View style={{flexDirection: 'column', flex: 1}}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.surveyTitle}>{schema.description}</Text>

          <SurveyQuestion response={currentResponse} onChange={setResponse} />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        {questionIndex > 0 ? (
          <Pressable style={styles.cancelButton} onPress={prev}>
            <Text style={styles.buttonText}>Previous</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.cancelButton} onPress={prev}>
            <Text style={styles.buttonText}>Back</Text>
          </Pressable>
        )}
        <Text style={styles.feedbackText}>
          Question {questionIndex + 1} / {questionCount}
        </Text>
        {questionIndex === questionCount - 1 ? (
          <Pressable
            style={continueBtnStyle}
            disabled={!canContinue}
            onPress={submit}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        ) : (
          <Pressable
            style={continueBtnStyle}
            disabled={!canContinue}
            onPress={next}>
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 15,
  },
  surveyTitle: {
    color: '#333',
    fontSize: 22,
    marginTop: 25,
    marginBottom: 50,
  },
  surveyQuestion: {
    marginBottom: 25,
    width: '100%',
  },
  surveyQuestionText: {
    marginBottom: 25,
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#666',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  submitButtonDisabled: {
    backgroundColor: 'green',
    opacity: 0.5,
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  feedbackText: {
    fontSize: 18,
  },
  buttonContainer: {
    height: 50,
    marginBottom: 80,
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 0,
    flexDirection: 'row',
  },
  textInputBox: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  multiLineTextInputBox: {
    height: 200,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  picker: {
    color: 'black',
    fontSize: 16,
    height: 200,
  },
  booleanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  booleanValue: {
    marginLeft: 10,
    fontSize: 18,
    minWidth: 50,
  },
  hint: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});
