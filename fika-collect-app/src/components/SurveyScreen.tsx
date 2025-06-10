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
  Platform,
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
import {useLocationLookup} from '../hooks/useLocationLookup';

type SurveyScreenProps = {
  route: {params: SurveyParams};
};

type LonLat = {
  longitude: number;
  latitude: number;
};

interface SurveyQuestionProps {
  response: SurveyQuestionResponse;
  onChange: (value: any, stringValue?: any) => void;
  questionCount: number;
  questionIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  canContinue: boolean;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
}

function ShortAnswerQuestion({
  inputMode = 'text',
  response,
  onChange,
  onPrevious,
  onNext,
  questionCount,
  questionIndex,
}: SurveyQuestionProps) {
  const {question} = response;
  const {localize} = useLocalization();

  return (
    <SurveyQuestionWrapper
      questionCount={questionCount}
      questionIndex={questionIndex}
      onPrevious={onPrevious}
      onNext={onNext}
      canContinue={response.canContinue}>
      <View style={styles.surveyQuestion}>
        <Text style={styles.surveyQuestionText}>
          {localize(question.question)}
        </Text>
        <TextInput
          inputMode={inputMode}
          style={styles.textInputBox}
          value={response.value}
          onChangeText={text => onChange(text)}
          placeholder={localize(question.hint)}
          placeholderTextColor={'#666'}
        />
      </View>
    </SurveyQuestionWrapper>
  );
}

function NumericQuestion(props: SurveyQuestionProps) {
  return (
    <ShortAnswerQuestion
      {...props}
      inputMode="numeric"
      keyboardType="numeric"
    />
  );
}

function PhoneQuestion(props: SurveyQuestionProps) {
  return (
    <ShortAnswerQuestion {...props} inputMode="tel" keyboardType="phone-pad" />
  );
}

function EmailQuestion(props: SurveyQuestionProps) {
  return (
    <ShortAnswerQuestion
      {...props}
      inputMode="email"
      keyboardType="email-address"
    />
  );
}

function LongAnswerQuestion({
  response,
  onChange,
  questionIndex,
  questionCount,
  onPrevious,
  onNext,
  canContinue,
}: SurveyQuestionProps) {
  const {question} = response;
  const {localize} = useLocalization();
  return (
    <SurveyQuestionWrapper
      questionCount={questionCount}
      questionIndex={questionIndex}
      onPrevious={onPrevious}
      onNext={onNext}
      canContinue={canContinue}>
      <View style={styles.surveyQuestion}>
        <Text style={styles.surveyQuestionText}>
          {localize(question.question)}
        </Text>
        <TextInput
          style={styles.multiLineTextInputBox}
          multiline
          textAlignVertical="top"
          value={response.value}
          onChangeText={text => onChange(text)}
          placeholder={localize(question.hint)}
          placeholderTextColor={'#666'}
        />
      </View>
    </SurveyQuestionWrapper>
  );
}

function BooleanQuestion({
  response,
  onChange,
  questionIndex,
  questionCount,
  onPrevious,
  onNext,
  canContinue,
}: SurveyQuestionProps) {
  const {question} = response;
  const placeholder = question.hint;
  const {localize, getString} = useLocalization();

  return (
    <SurveyQuestionWrapper
      questionCount={questionCount}
      questionIndex={questionIndex}
      onPrevious={onPrevious}
      onNext={onNext}
      canContinue={canContinue}>
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
    </SurveyQuestionWrapper>
  );
}

function MultipleChoiceQuestion({
  response,
  onChange,
  questionCount,
  questionIndex,
  onNext,
  onPrevious,
  canContinue,
}: SurveyQuestionProps) {
  const {question} = response;
  const {localize} = useLocalization();

  return (
    <SurveyQuestionWrapper
      questionCount={questionCount}
      questionIndex={questionIndex}
      onPrevious={onPrevious}
      onNext={onNext}
      canContinue={canContinue}>
      <View style={styles.surveyQuestion}>
        <Text style={styles.surveyQuestionText}>
          {localize(question.question)}
        </Text>
        <Picker
          itemStyle={sharedStyles.picker}
          selectedValue={response.value}
          onValueChange={value => onChange(value)}>
          {question.options &&
            question.options.map((option, index) => (
              <Picker.Item
                color="black"
                key={`option-${index}`}
                label={localize(option)}
                value={option.en}
              />
            ))}
        </Picker>
      </View>
    </SurveyQuestionWrapper>
  );
}

function MultiSelectQuestion({
  response,
  onChange,
  onPrevious,
  onNext,
  questionCount,
  questionIndex,
  canContinue,
}: SurveyQuestionProps) {
  const {question} = response;
  const {localize} = useLocalization();

  const selectedOptions = response.value || [];
  const options = question.options || [];

  const initialSelectedState = options.map(option =>
    selectedOptions.includes(option.en.trim()),
  );
  const [selectedState, setSelectedValues] =
    useState<boolean[]>(initialSelectedState);

  return (
    <SurveyQuestionWrapper
      questionCount={questionCount}
      questionIndex={questionIndex}
      onPrevious={onPrevious}
      onNext={onNext}
      canContinue={canContinue}>
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
                const selectedOptions = options
                  .filter((_, i) => newSelectedState[i])
                  .map(({en}) => en.trim());
                onChange(selectedOptions);
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
    </SurveyQuestionWrapper>
  );
}

function AdminLocationQuestion({
  response,
  onChange,
  questionCount,
  questionIndex,
  onNext,
  onPrevious,
  canContinue,
}: SurveyQuestionProps) {
  let {locations, error} = useLocationLookup();
  const {localize, getString} = useLocalization();
  const [locationPath, setLocation] = useState<string[]>(response.value || []);
  const [curPathPart, setCurPathPart] = useState<string | null>(null);

  const pathOptions = navigatePath(locationPath);
  console.log(pathOptions);

  useEffect(() => {
    if (!locations || curPathPart !== null) {
      return;
    }
    console.log('Do the effect thing');
    setCurPathPart(Object.keys(locations)[0]);
  }, [locations, curPathPart]);

  if (!locations) {
    return (
      <View style={styles.container}>
        <Text style={styles.surveyQuestionText}>
          {getString('loadingLocations')}
        </Text>
      </View>
    );
  }

  if (error) {
    console.error(error);
    return <Text>{getString('errorLoadingLocations')}</Text>;
  }

  function navigatePath(path: string[]): string[] | null {
    let curobj: {[key: string]: any} = locations as {[key: string]: any};
    if (!curobj) {
      return null;
    }
    for (let i = 0; i < path.length; i++) {
      if (path[i] in curobj) {
        curobj = curobj[path[i]];
        if (!curobj) {
          return null;
        }
      } else {
        return null;
      }
    }
    if (Array.isArray(curobj)) {
      return curobj.map((item: any) => item[0]);
    } else {
      return Object.keys(curobj || ['Other']);
    }
  }

  function onSelectAdminLevel(value: string | null) {
    if (value === null) {
      return;
    }
    setCurPathPart(value);
  }

  function pushPathPart(part: string) {
    const newPath = locationPath.concat(part);
    setLocation(newPath);
    const nextParts = navigatePath(newPath);
    if (nextParts) {
      setCurPathPart(nextParts[0]);
    }
  }

  function popPathPart() {
    const newPath = locationPath.slice(0, -1);
    setLocation(newPath);
    const nextParts = navigatePath(newPath);
    if (nextParts) {
      setCurPathPart(nextParts[0]);
    }
  }

  const next = (part: string | null) => {
    if (pathOptions) {
      if (part) {
        pushPathPart(part);
      }
    } else {
      response.value = locationPath.join(' > ');
      onChange && onChange(locationPath, locationPath.join(' > '));
      onNext();
    }
  };

  const prev = () => {
    if (locationPath.length === 0) {
      onPrevious();
    } else {
      popPathPart();
    }
  };

  const {question} = response;
  return (
    <SurveyQuestionWrapper
      questionCount={questionCount}
      questionIndex={questionIndex}
      onPrevious={prev}
      onNext={() => next(curPathPart)}
      canContinue={canContinue}>
      <View style={styles.surveyQuestion}>
        <Text style={styles.surveyQuestionText}>
          {localize(question.question)}
        </Text>
        {!locations && <Text>{localize('loadingLocations')}</Text>}
        {locations && (
          <View>
            <View style={styles.locationEchoRow}>
              <Text style={styles.locationEchoText}>
                {locationPath.join(' > ')}
              </Text>
            </View>

            {pathOptions && (
              <View>
                <View
                  style={[
                    sharedStyles.sectionHeaderContainer,
                    {marginTop: 50},
                  ]}>
                  <Text style={sharedStyles.sectionHeaderText}>
                    {getString('selectYourLocation')}
                  </Text>

                  <Picker
                    itemStyle={sharedStyles.picker}
                    selectedValue={curPathPart}
                    onValueChange={value => {
                      console.log('selected value:', value);
                      onSelectAdminLevel(value);
                      if (Platform.OS === 'android') {
                        next(value);
                      }
                    }}>
                    {pathOptions.map((option, index) => (
                      <Picker.Item
                        color="black"
                        key={`option-${index}`}
                        label={localize(option)}
                        value={option}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
            {
              null /*
            <View style={styles.locationButtonContainer}>
              <Pressable
                onPress={prev}
                style={({pressed}) => [
                  sharedStyles.button,
                  sharedStyles.buttonSecondary,
                  locationPath.length === 0 ? sharedStyles.buttonDisabled : {},
                  pressed ? sharedStyles.buttonPressed : {},
                ]}>
                <Text style={sharedStyles.buttonText}>Back</Text>
              </Pressable>
              <Pressable
                onPress={next}
                style={({pressed}) => [
                  sharedStyles.button,
                  pressed ? sharedStyles.buttonPressed : {},
                ]}>
                <Text style={sharedStyles.buttonText}>Select</Text>
              </Pressable>
            </View>*/
            }
          </View>
        )}
      </View>
    </SurveyQuestionWrapper>
  );
}

let GEOLOCATION_AUTHORIZATION: boolean | null = null;

function GeolocationQuestion({
  response,
  onChange,
  questionIndex,
  questionCount,
  onNext,
  onPrevious,
  canContinue,
}: SurveyQuestionProps) {
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
      const lonLat = (await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            const value: LonLat = {longitude, latitude};
            resolve(value);
          },
          error => reject(error),
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      })) as LonLat;

      setStatusMessage('');
      console.log('Got location:', lonLat);

      response.value = lonLat;
      response.stringValue = `${lonLat.longitude}, ${lonLat.latitude}`;
      onChange && onChange(lonLat, response.stringValue);
    } catch (error) {
      Alert.alert(
        getString('geolocationUnable'),
        getString('geolocationPleaseEnable'),
      );
      setStatusMessage(getString('geolocationUnable'));
    }
  };

  return (
    <SurveyQuestionWrapper
      questionCount={questionCount}
      questionIndex={questionIndex}
      onPrevious={onPrevious}
      onNext={onNext}
      canContinue={canContinue}>
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
            {getString('geolocationDenied')}{' '}
            {getString('geolocationPleaseEnable')}
          </Text>
        )}

        <View style={{marginTop: 40}}>
          <TextInput
            style={styles.textInputBox}
            value={response.stringValue}
            editable={false}
          />
          <Text style={[styles.warning, {marginTop: 10}]}>{statusMessage}</Text>
        </View>
      </View>
    </SurveyQuestionWrapper>
  );
}

function PhotoQuestion({
  response,
  onChange,
  onPrevious,
  onNext,
  questionCount,
  questionIndex,
  canContinue,
}: SurveyQuestionProps) {
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
    <SurveyQuestionWrapper
      questionCount={questionCount}
      questionIndex={questionIndex}
      onPrevious={onPrevious}
      onNext={onNext}
      canContinue={canContinue}>
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
            <Button
              onPress={() => onChange('')}
              title="Use a different photo"
            />
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
    </SurveyQuestionWrapper>
  );
}

function SurveyQuestion({
  response,
  onChange,
  questionCount,
  questionIndex,
  onPrevious,
  onNext,
  canContinue,
}: SurveyQuestionProps) {
  const {question} = response;
  let Component = null;
  switch (question.type) {
    case 'boolean':
      Component = BooleanQuestion;
      break;
    case 'short_answer':
      Component = ShortAnswerQuestion;
      break;
    case 'numeric':
      Component = NumericQuestion;
      break;
    case 'phone':
      Component = PhoneQuestion;
      break;
    case 'email':
      Component = EmailQuestion;
      break;
    case 'long_answer':
      Component = LongAnswerQuestion;
      break;
    case 'select':
      Component = MultipleChoiceQuestion;
      break;
    case 'multiselect':
      Component = MultiSelectQuestion;
      break;
    // @ts-ignore
    case 'location': // deprecated
    case 'geolocation':
      Component = GeolocationQuestion;
      break;
    case 'admin_location':
      Component = AdminLocationQuestion;
      break;
    case 'photo':
      Component = PhotoQuestion;
      break;
  }

  if (!Component) {
    return null;
  }
  return (
    <Component
      response={response}
      onChange={onChange}
      questionCount={questionCount}
      questionIndex={questionIndex}
      onPrevious={onPrevious}
      onNext={onNext}
      canContinue={canContinue}
    />
  );
}

interface SurveyQuestionWrapperProps {
  children: React.ReactNode;
  questionCount: number;
  questionIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  canContinue: boolean;
}

function SurveyQuestionWrapper(props: SurveyQuestionWrapperProps) {
  const {questionIndex, onPrevious, onNext, questionCount, canContinue} = props;
  const {getString} = useLocalization();

  return (
    <View style={{flexDirection: 'column', flex: 1}}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{
          maxHeight:
            Dimensions.get('window').height -
            (Platform.OS === 'ios' ? 220 : 150),
        }}>
        <View style={styles.container}>{props.children}</View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable
          style={({pressed}) => [
            sharedStyles.button,
            sharedStyles.buttonSecondary,
            styles.submitRowButton,
            pressed ? sharedStyles.buttonSecondaryPressed : {},
          ]}
          onPress={onPrevious}>
          <Text style={sharedStyles.buttonText}>
            {questionIndex > 0
              ? getString('previousButton')
              : getString('backButton')}
          </Text>
        </Pressable>
        <Text style={styles.feedbackText}>
          {questionIndex + 1} / {questionCount}
        </Text>
        <Pressable
          style={({pressed}) => [
            sharedStyles.button,
            styles.submitRowButton,
            canContinue ? {} : sharedStyles.buttonDisabled,
            pressed ? sharedStyles.buttonPressed : {},
          ]}
          disabled={!canContinue}
          onPress={onNext}>
          <Text style={sharedStyles.buttonText}>
            {getString(
              questionIndex === questionCount - 1
                ? 'submitButton'
                : 'nextButton',
            )}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function SurveyScreen(props: SurveyScreenProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [revision, setRevision] = useState(0);
  const netInfo = useNetInfo();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const {getString, localize} = useLocalization();

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

  const next = () => {
    if (!canContinue) {
      return;
    }

    if (questionIndex === questionCount - 1) {
      submit();
      return;
    } else {
      setQuestionIndex(questionIndex + 1);
    }
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
        },
      );
    } else {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const navigation = useNavigation();

  const setResponse = (value: any, stringValue?: string) => {
    currentResponse.value = value;
    currentResponse.stringValue = stringValue || value;
    setRevision(revision + 1);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      style={{flex: 1}}>
      <View style={styles.titleContainer}>
        <Text style={styles.surveyTitle}>{localize(survey.title)}</Text>
      </View>
      <SurveyQuestion
        key={questionIndex}
        response={currentResponse}
        onChange={setResponse}
        questionIndex={questionIndex}
        questionCount={questionCount}
        onPrevious={prev}
        onNext={next}
        canContinue={canContinue}
      />
      {submitting && (
        <View style={styles.overlay}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Submitting...</Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 15,
    paddingTop: 30,
  },
  titleContainer: {
    flex: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#e8e8e8',
  },
  surveyTitle: {
    color: '#333',
    fontSize: 22,
    marginTop: 0,
    marginBottom: 0,
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
    marginBottom: 10,
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
  locationButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  locationEchoRow: {
    marginTop: 20,
    marginBottom: 20,
    minHeight: 60,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  locationEchoText: {
    lineHeight: 30,
    fontSize: 18,
    color: '#367845',
    fontWeight: 'bold',
  },
  submitRowButton: {
    minWidth: 100,
    alignItems: 'center',
  },
});
