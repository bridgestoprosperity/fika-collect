import {useState, useContext, useEffect} from 'react';
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
import {useCameraPermission} from 'react-native-vision-camera';
import {useCameraDevice} from 'react-native-vision-camera';
import BlastedImage from 'react-native-blasted-image';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNetInfo} from '@react-native-community/netinfo';
import Geolocation from '@react-native-community/geolocation';
import {useLocalization} from '../hooks/useLocalization';

type SurveyScreenProps = {
  route: {params: SurveyParams};
};

interface SurveyQuestionProps {
  response: SurveyQuestionResponse;
  onChange: (value: string) => void;
}

function ShortAnswerQuestion({response, onChange}: SurveyQuestionProps) {
  const {question} = response;
  const {localize} = useLocalization();

  return (
    <View style={styles.surveyQuestion}>
      <Text style={styles.surveyQuestionText}>
        {localize(question.question)}
      </Text>
      <TextInput
        style={styles.textInputBox}
        value={response.value}
        onChangeText={text => onChange(text)}
        placeholder={localize(question.hint)}
        placeholderTextColor={'#666'}
      />
    </View>
  );
}

function LongAnswerQuestion({response, onChange}: SurveyQuestionProps) {
  const {question} = response;
  const {localize} = useLocalization();
  return (
    <View style={styles.surveyQuestion}>
      <Text style={styles.surveyQuestionText}>
        {localize(question.question)}
      </Text>
      <TextInput
        style={styles.multiLineTextInputBox}
        multiline
        value={response.value}
        onChangeText={text => onChange(text)}
        placeholder={localize(question.hint)}
        placeholderTextColor={'#666'}
      />
    </View>
  );
}

function BooleanQuestion({response, onChange}: SurveyQuestionProps) {
  const {question} = response;
  const placeholder = question.hint;
  const {localize, getString} = useLocalization();

  return (
    <View style={styles.surveyQuestion}>
      <Text style={styles.surveyQuestionText}>
        {localize(question.question)}
      </Text>

      <View style={styles.booleanRow}>
        <Switch
          value={response.value === 'yes'}
          onValueChange={value => onChange(value ? 'yes' : 'no')}
        />
        <Text style={styles.booleanValue}>
          {response.value === 'yes'
            ? getString('booleanQuestionYes')
            : getString('booleanQuestionNo')}
        </Text>
      </View>
      {placeholder ? (
        <View style={{marginTop: 40}}>
          <Text style={styles.hint}>{localize(placeholder)}</Text>
        </View>
      ) : null}
    </View>
  );
}

function MultipleChoiceQuestion({response, onChange}: SurveyQuestionProps) {
  const {question} = response;
  const {localize} = useLocalization();

  return (
    <View style={styles.surveyQuestion}>
      <Text style={styles.surveyQuestionText}>
        {localize(question.question)}
      </Text>
      <Picker
        itemStyle={styles.picker}
        selectedValue={response.value}
        onValueChange={value => onChange(value)}>
        {question.options &&
          question.options.map((option, index) => (
            <Picker.Item
              key={`option-${index}`}
              label={localize(option)}
              value={option}
            />
          ))}
      </Picker>
    </View>
  );
}

function MultiSelectQuestion({response, onChange}: SurveyQuestionProps) {
  const {question} = response;
  const {localize} = useLocalization();

  const selectedOptions = response.value
    .split(',')
    .map(option => option.trim());

  const options = question.options || [];

  const initialSelectedState = options.map(option =>
    selectedOptions.includes(option.en.trim()),
  );
  const [selectedState, setSelectedValues] =
    useState<boolean[]>(initialSelectedState);

  return (
    <View style={styles.surveyQuestion}>
      <Text style={styles.surveyQuestionText}>
        {localize(question.question)}
      </Text>

      {options.map((option, index) => (
        <View key={`option-${index}`} style={styles.booleanRow}>
          <Pressable
            style={styles.multiselectRow}
            onPress={() => {
              const newSelectedState = [...selectedState];
              newSelectedState[index] = !newSelectedState[index];
              setSelectedValues(newSelectedState);
              const selectedOptions = options.filter(
                (_, i) => newSelectedState[i],
              );
              onChange(selectedOptions.join(', '));
            }}>
            <View
              style={[
                styles.multiselectCheckbox,
                selectedState[index] && styles.multiselectCheckboxChecked,
              ]}
            />
            <Text style={styles.multiselectCheckboxText}>
              {localize(option)}
            </Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

let GEOLOCATION_AUTHORIZATION: boolean | null = null;

function LocationQuestion({response, onChange}: SurveyQuestionProps) {
  const {question} = response;
  const [authDenial, setAuthDenial] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const {localize, getString} = useLocalization();

  const getLocation = async () => {
    try {
      console.log({GEOLOCATION_AUTHORIZATION});
      setStatusMessage(getString('gelocationRequesting'));
      // Work around this bug in which authorization stalls on subsequent calls:
      // https://github.com/michalchudziak/react-native-geolocation/issues/335
      if (GEOLOCATION_AUTHORIZATION === null) {
        await new Promise((resolve, reject) => {
          console.log('Requesting authorization...');
          Geolocation.requestAuthorization(
            () => {
              console.log('Auth granted');
              GEOLOCATION_AUTHORIZATION = true;
              setAuthDenial(false);
              resolve(null);
            },
            () => {
              console.log('Auth denied');
              GEOLOCATION_AUTHORIZATION = false;
              setAuthDenial(true);
              setStatusMessage(getString('geolocationDenied'));
              reject();
            },
          );
        });
      } else {
        if (GEOLOCATION_AUTHORIZATION === false) {
          setAuthDenial(true);
          Alert.alert(
            getString('geolocationDenied'),
            getString('geolocationPleaseEnable'),
          );
          setStatusMessage(getString('geolocationDenied'));
          return;
        }
      }

      console.log('Requesting position...');
      const location = (await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            const value = `${latitude},${longitude}`;
            resolve(value);
          },
          error => reject(error),
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      })) as string;

      setStatusMessage('');
      console.log('Got location:', location);

      response.value = location;
      onChange && onChange(location);
    } catch (error) {
      Alert.alert(getString('error'), getString('geolocationUnable'));
      console.error(error);
    }
  };

  return (
    <View style={styles.surveyQuestion}>
      <Text style={styles.surveyQuestionText}>
        {localize(question.question)}
      </Text>
      <Button
        title={getString('geolocationGetLocationButton')}
        onPress={getLocation}
      />
      {authDenial && (
        <Text style={styles.warning}>
          Location permission denied. Please enable location permission in the
          app settings.
        </Text>
      )}

      <View style={{marginTop: 40}}>
        <TextInput
          style={styles.textInputBox}
          value={response.value}
          editable={false}
        />
        <Text style={[styles.warning, {marginTop: 10}]}>{statusMessage}</Text>
      </View>
    </View>
  );
}

function PhotoQuestion({response, onChange}: SurveyQuestionProps) {
  const [cameraVisible, setCameraVisible] = useState(false);
  const {question} = response;
  const device = useCameraDevice('back');
  const filePath = response.value;
  const hasCameraPermission = useCameraPermission();
  const {localize, getString} = useLocalization();

  const onCapture = async (path: string) => {
    setCameraVisible(false);
    onChange(path);
  };

  const cancel = () => {
    setCameraVisible(false);
  };

  return (
    <View style={styles.surveyQuestion}>
      <Text style={styles.surveyQuestionText}>
        {localize(question.question)}
      </Text>
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
          {hasCameraPermission ? (
            device ? (
              <View style={{marginBottom: 15}}>
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
              <Text style={styles.warning}>
                {getString('noCameraAvailable')}
              </Text>
            )
          ) : (
            <Text style={styles.warning}>
              {getString('cameraPermissionRequired')}
            </Text>
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
            title={getString('selectPhotoFromLibrary')}
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
    case 'multiselect':
      return <MultiSelectQuestion response={response} onChange={onChange} />;
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
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const {localize, getString} = useLocalization();

  const surveyResponseManager = useContext<SurveyResponseManager>(
    SurveyResponseManagerContext,
  );

  const {
    route: {
      params: {response},
    },
  } = props;

  const survey = response.schema;
  const questionCount = survey.questions.length;
  const currentResponse = response.responses[questionIndex];
  const canContinue =
    currentResponse.hasResponse || currentResponse.type === 'multiselect';

  const next = () => {
    if (!canContinue) {
      return;
    }
    setQuestionIndex(questionIndex + 1);
  };

  const prev = () => {
    if (questionIndex === 0) {
      Alert.alert(
        getString('discardResponseTitle'),
        getString('discardResponseMessage'),
        [
          {
            text: getString('cancelButton'),
            onPress: () => setQuestionIndex(questionIndex),
            style: 'cancel',
          },
          {
            text: getString('discardButton'),
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
          onPress: async () => {
            await surveyResponseManager.storeResponse(response);
            if (netInfo.isInternetReachable) {
              setSubmitting(true);
            } else {
              Alert.alert(
                'No internet connection',
                'Your response has been saved locally. To submit the response, please re-open the app and check the Responses tab when you have an internet connection.',
              );
              navigation.goBack();
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  useEffect(() => {
    if (!submitting || submitted) return;
    surveyResponseManager
      .uploadResponse(response)
      .then(() => {
        setSubmitting(false);
        setSubmitted(true);
        Alert.alert('Survey response submitted successfully!');
        navigation.goBack();
      })
      .catch(error => {
        console.error(error);
        setSubmitting(false);
        Alert.alert(
          'Error submitting survey',
          'Your response has been saved locally. To submit the response, please re-open the app and check the Responses tab when you have an internet connection.',
        );
        navigation.goBack();
      });
  }, [submitting, submitted, surveyResponseManager, navigation, response]);

  return (
    <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
      <View style={{flexDirection: 'column', flex: 1}}>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.surveyTitle}>{localize(survey.title)}</Text>

            <SurveyQuestion
              key={questionIndex}
              response={currentResponse}
              onChange={setResponse}
            />
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
              {questionIndex > 0
                ? getString('previousButton')
                : getString('backButton')}
            </Text>
          </Pressable>
          <Text style={styles.feedbackText}>
            {getString('questionCountLabel')} {questionIndex + 1} /{' '}
            {questionCount}
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
              <Text style={sharedStyles.buttonText}>
                {getString('nextButton')}
              </Text>
            </Pressable>
          )}
        </View>
        {submitting && (
          <View style={styles.overlay}>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>Submitting...</Text>
            </View>
          </View>
        )}
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
    lineHeight: 30,
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
  multiselectRow: {
    width: '100%',
    padding: 10,
    marginLeft: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  multiselectCheckbox: {
    flex: 0,
    width: 25,
    height: 25,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: 'white',
    marginRight: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  multiselectCheckboxChecked: {
    backgroundColor: '#367845',
  },
  multiselectCheckboxText: {
    marginLeft: 8,
    fontSize: 16,
  },
});
