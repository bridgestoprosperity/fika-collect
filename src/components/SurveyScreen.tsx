import {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Modal,
  Button,
  Dimensions,
} from 'react-native';
import {type SurveyResponseManager} from '../data/SurveyResponseManager';
import SurveyResponseManagerContext from '../data/SurveyResponseManagerContext';
import {Picker} from '@react-native-picker/picker';
import {type SurveyParams} from '../types.d';
import {SurveyQuestionResponse} from '../data/SurveyResponse';
import {useNavigation} from '@react-navigation/native';
import sharedStyles from '../styles';
import CameraController from './CameraController';
import {useCameraDevice} from 'react-native-vision-camera';
import {type PhotoFile} from 'react-native-vision-camera';
import BlastedImage from 'react-native-blasted-image';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNetInfo} from '@react-native-community/netinfo';

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
        placeholderTextColor={'#666'}
      />
    </View>
  );
}

function LongAnswerQuestion({response, onChange}: SurveyQuestionProps) {
  const {question} = response;
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

function PhotoQuestion({response, onChange}: SurveyQuestionProps) {
  const [cameraVisible, setCameraVisible] = useState(false);
  const {question} = response;
  const device = useCameraDevice('back');
  const filePath = response.value;

  const onCapture = async (file: PhotoFile) => {
    setCameraVisible(false);
    onChange(file.path);
  };

  const cancel = () => {
    setCameraVisible(false);
  };

  return (
    <View style={styles.surveyQuestion}>
      <Text style={styles.surveyQuestionText}>{question.question}</Text>
      {filePath ? (
        <View>
          <View style={styles.previewContainer}>
            <BlastedImage
              source={{uri: filePath}}
              style={styles.imagePreview}
              resizeMode="cover"
              width={Dimensions.get('window').width * 0.5}
              height={Dimensions.get('window').width * 0.8}
            />
          </View>
          <Button onPress={() => onChange('')} title="Use a different photo" />
        </View>
      ) : (
        <View>
          {device ? (
            <View>
              <Button
                onPress={() => setCameraVisible(true)}
                title="Take photo"
              />
              <Modal
                visible={cameraVisible}
                onRequestClose={() => setCameraVisible(false)}
                animationType="slide"
                presentationStyle="fullScreen">
                <CameraController
                  device={device}
                  cancel={cancel}
                  onCapture={onCapture}
                />
              </Modal>
            </View>
          ) : (
            <Text style={styles.warning}>No camera available!</Text>
          )}
          <Button
            onPress={async () => {
              const result = await launchImageLibrary({
                mediaType: 'photo',
                selectionLimit: 1,
              });
              const uri = result?.assets?.[0]?.uri;
              if (!uri) return;
              onChange(uri);
            }}
            title="Select from library"
          />
        </View>
      )}
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
    case 'photo':
      return <PhotoQuestion response={response} onChange={onChange} />;
    default:
      return null;
  }
}

export default function SurveyScreen(props: SurveyScreenProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [revision, setRevision] = useState(0);
  const netInfo = useNetInfo();

  const surveyResponseManager = useContext<SurveyResponseManager>(
    SurveyResponseManagerContext,
  );

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

  const navigation = useNavigation();

  const setResponse = (value: string) => {
    currentResponse.value = value;
    setRevision(revision + 1);
  };

  const submit = () => {
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
          onPress: () => {
            surveyResponseManager
              .storeResponse(response)
              .then(() => {
                if (netInfo.isInternetReachable) {
                  surveyResponseManager.uploadResponses();
                } else {
                  Alert.alert(
                    'No internet connection',
                    'Your response will be uploaded when you are back online.',
                  );
                }
              })
              .then(() => {
                navigation.goBack();
              });
          },
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
    <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
      <View style={{flexDirection: 'column', flex: 1}}>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.surveyTitle}>{schema.title}</Text>

            <SurveyQuestion response={currentResponse} onChange={setResponse} />
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Pressable
            style={({pressed}) => [
              sharedStyles.button,
              sharedStyles.buttonSecondary,
              pressed ? sharedStyles.buttonSecondaryPressed : {},
            ]}
            onPress={prev}>
            <Text style={sharedStyles.buttonText}>
              {questionIndex > 0 ? 'Previous' : 'Back'}
            </Text>
          </Pressable>
          <Text style={styles.feedbackText}>
            Question {questionIndex + 1} / {questionCount}
          </Text>
          {questionIndex === questionCount - 1 ? (
            <Pressable
              style={({pressed}) => [
                sharedStyles.button,
                canContinue ? {} : sharedStyles.buttonDisabled,
                pressed ? sharedStyles.buttonPressed : {},
              ]}
              disabled={!canContinue}
              onPress={submit}>
              <Text style={sharedStyles.buttonText}>Submit</Text>
            </Pressable>
          ) : (
            <Pressable
              style={({pressed}) => [
                sharedStyles.button,
                canContinue ? {} : sharedStyles.buttonDisabled,
                pressed ? sharedStyles.buttonPressed : {},
              ]}
              disabled={!canContinue}
              onPress={next}>
              <Text style={sharedStyles.buttonText}>Next</Text>
            </Pressable>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
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
    marginTop: 15,
    marginBottom: 50,
    fontWeight: 700,
  },
  surveyQuestion: {
    marginBottom: 25,
    width: '100%',
  },
  surveyQuestionText: {
    marginBottom: 25,
    fontSize: 20,
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
    fontSize: 18,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  multiLineTextInputBox: {
    fontSize: 18,
    height: 200,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  picker: {
    color: 'black',
    fontSize: 20,
    height: 200,
  },
  booleanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  booleanValue: {
    marginLeft: 10,
    fontSize: 20,
    minWidth: 50,
  },
  hint: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
  },
  camera: {
    height: 400,
  },
  imagePreview: {},
  previewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  warning: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
    alignSelf: 'center',
    marginBottom: 20,
  },
});
