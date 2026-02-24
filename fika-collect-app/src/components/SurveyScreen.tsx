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
import {
  useCameraDevice,
  useLocationPermission,
} from 'react-native-vision-camera';
import BlastedImage from 'react-native-blasted-image';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNetInfo} from '@react-native-community/netinfo';
import Geolocation from '@react-native-community/geolocation';
import {useLocalization} from '../hooks/useLocalization';
import {useLocationLookup} from '../hooks/useLocationLookup';
import {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  shadows,
} from '../theme';
import {
  AnimatedCheckbox,
  AnimatedTextInput,
  LoadingSpinner,
  ProgressBar,
} from './ui';

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
        <AnimatedTextInput
          inputMode={inputMode}
          value={response.value}
          onChangeText={text => onChange(text)}
          placeholder={localize(question.hint)}
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
        <AnimatedTextInput
          multiline
          value={response.value}
          onChangeText={text => onChange(text)}
          placeholder={localize(question.hint)}
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
            trackColor={{false: colors.border, true: colors.primaryLight}}
            thumbColor={response.value === 'yes' ? colors.primary : colors.borderDark}
          />
          <Text style={styles.booleanValue}>
            {response.value === 'yes'
              ? getString('booleanQuestionYes')
              : getString('booleanQuestionNo')}
          </Text>
        </View>
        {placeholder ? (
          <View style={{marginTop: spacing.xl}}>
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
          itemStyle={sharedStyles.pickerItem}
          style={sharedStyles.picker}
          dropdownIconRippleColor={colors.border}
          dropdownIconColor={colors.text}
          selectedValue={response.value}
          onValueChange={value => onChange(value)}>
          {question.options &&
            question.options.map((option, index) => (
              <Picker.Item
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

  const currentSelectedOptions = response.value || [];
  const options = question.options || [];

  const initialSelectedState = options.map(option =>
    currentSelectedOptions.includes(option.en.trim()),
  );
  const [selectedState, setSelectedValues] =
    useState<boolean[]>(initialSelectedState);

  const handleToggle = (index: number) => {
    const newSelectedState = [...selectedState];
    newSelectedState[index] = !newSelectedState[index];
    setSelectedValues(newSelectedState);
    const newSelectedOptions = options
      .filter((_, i) => newSelectedState[i])
      .map(({en}) => en.trim());
    onChange(newSelectedOptions);
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

        {options.map((option, index) => (
          <AnimatedCheckbox
            key={`option-${index}`}
            checked={selectedState[index]}
            onPress={() => handleToggle(index)}
            label={localize(option)}
          />
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
  const [locationPath, setLocation] = useState<string[]>(
    response.value?.selection || [],
  );
  const [curPathPart, setCurPathPart] = useState<string | null>(null);

  const pathOptions = navigatePath(locationPath);

  useEffect(() => {
    if (!locations || curPathPart !== null) {
      return;
    }
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
      } else if (Array.isArray(curobj)) {
        return null;
      } else if (!curobj) {
        return null;
      }
    }
    return Array.isArray(curobj) ? curobj : Object.keys(curobj);
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
      response.value = {location: locationPath};
      onChange && onChange(response.value, locationPath.join(' > '));
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
                    {marginTop: spacing['2xl']},
                  ]}>
                  <Text style={sharedStyles.sectionHeaderText}>
                    {getString('selectYourLocation')}
                  </Text>

                  <Picker
                    dropdownIconRippleColor={colors.border}
                    dropdownIconColor={colors.text}
                    style={sharedStyles.picker}
                    itemStyle={sharedStyles.pickerItem}
                    selectedValue={curPathPart}
                    onValueChange={value => {
                      onSelectAdminLevel(value);
                      if (Platform.OS === 'android') {
                        next(value);
                      }
                    }}>
                    {pathOptions.map((option, index) => (
                      <Picker.Item
                        key={`option-${index}`}
                        label={localize(option)}
                        value={option}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </SurveyQuestionWrapper>
  );
}

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
  const [statusMessage, setStatusMessage] = useState('');
  const {localize, getString} = useLocalization();
  const [getLocationInitiated, setGetLocationInitiated] = useState(false);

  const {hasPermission, requestPermission} = useLocationPermission();

  const getLocation = async () => {
    if (hasPermission) {
      setStatusMessage(getString('gelocationRequesting'));
      setGetLocationInitiated(true);
    } else {
      requestPermission().then(granted => {
        if (granted) {
          setStatusMessage(getString('gelocationRequesting'));
          setGetLocationInitiated(true);
        } else {
          setStatusMessage(getString('geolocationDenied'));
          Alert.alert(
            getString('geolocationDenied'),
            getString('geolocationPleaseEnable'),
          );
          setGetLocationInitiated(false);
        }
      });
    }
  };

  useEffect(() => {
    if (!hasPermission || !getLocationInitiated) {
      return;
    }
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const lonLat: LonLat = {longitude, latitude};

        setStatusMessage('');
        setGetLocationInitiated(false);

        response.value = lonLat;
        response.stringValue = `${lonLat.longitude},${lonLat.latitude}`;
        onChange && onChange(lonLat, response.stringValue);
      },
      () => {
        setGetLocationInitiated(false);
        Alert.alert(
          getString('geolocationUnable'),
          getString('geolocationPleaseEnable'),
        );
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, [hasPermission, getLocationInitiated, onChange, response, getString]);

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
        <Pressable
          style={({pressed}) => [
            styles.locationButton,
            pressed && {backgroundColor: colors.primaryPressed},
          ]}
          onPress={getLocation}>
          <Text style={styles.locationButtonText}>
            {getString('geolocationGetLocationButton')}
          </Text>
        </Pressable>
        <View style={{marginTop: spacing.xl}}>
          <TextInput
            style={styles.textInputBox}
            value={response.stringValue}
            editable={false}
          />
          <Text style={[styles.statusMessage, {marginTop: spacing.sm}]}>
            {statusMessage}
          </Text>
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
            <Pressable
              style={({pressed}) => [
                styles.photoButton,
                styles.photoButtonSecondary,
                pressed && {backgroundColor: colors.surfacePressed},
              ]}
              onPress={() => onChange('')}>
              <Text style={styles.photoButtonSecondaryText}>
                Use a different photo
              </Text>
            </Pressable>
          </View>
        ) : (
          <View>
            {hasCameraPermission ? (
              device ? (
                <View style={{marginBottom: spacing.md}}>
                  <Pressable
                    style={({pressed}) => [
                      styles.photoButton,
                      pressed && {backgroundColor: colors.primaryPressed},
                    ]}
                    onPress={() => setCameraVisible(true)}>
                    <Text style={styles.photoButtonText}>Take photo</Text>
                  </Pressable>
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
            <Pressable
              style={({pressed}) => [
                styles.photoButton,
                styles.photoButtonSecondary,
                pressed && {backgroundColor: colors.surfacePressed},
              ]}
              onPress={async () => {
                const result = await launchImageLibrary({
                  mediaType: 'photo',
                  selectionLimit: 1,
                });
                const uri = result?.assets?.[0]?.uri;
                if (!uri) {return;}
                onChange(uri);
              }}>
              <Text style={styles.photoButtonSecondaryText}>
                {getString('selectPhotoFromLibrary')}
              </Text>
            </Pressable>
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
            styles.navButton,
            styles.navButtonSecondary,
            pressed && {backgroundColor: colors.surfacePressed},
          ]}
          onPress={onPrevious}>
          <Text style={styles.navButtonSecondaryText}>
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
            styles.navButton,
            canContinue ? {} : styles.buttonDisabled,
            pressed && canContinue ? {backgroundColor: colors.primaryPressed} : {},
          ]}
          disabled={!canContinue}
          onPress={onNext}>
          <Text style={styles.navButtonText}>
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
  const canContinue = currentResponse.canContinue;

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
    currentResponse.stringValue = stringValue || value.toString();
    setRevision(revision + 1);
  };

  useEffect(() => {
    if (!submitting || submitted) {return;}
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

  const progress = (questionIndex + 1) / questionCount;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      style={{flex: 1, backgroundColor: colors.surface}}>
      <View style={styles.titleContainer}>
        <Text style={styles.surveyTitle}>{localize(survey.title)}</Text>
        <View style={styles.progressBarContainer}>
          <ProgressBar progress={progress} height={4} />
        </View>
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
            <LoadingSpinner size={40} />
            <Text style={styles.progressText}>{getString('submitting')}</Text>
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
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  titleContainer: {
    flex: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  progressBarContainer: {
    width: '100%',
    marginTop: spacing.sm,
  },
  surveyTitle: {
    color: colors.text,
    fontSize: fontSize['2xl'],
    marginTop: 0,
    marginBottom: 0,
    fontWeight: fontWeight.bold,
  },
  surveyQuestion: {
    marginBottom: spacing.lg,
    width: '100%',
  },
  surveyQuestionText: {
    marginBottom: spacing.lg,
    fontSize: fontSize.xl,
    lineHeight: 30,
    color: colors.text,
  },
  feedbackText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  buttonContainer: {
    height: 56,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  textInputBox: {
    fontSize: fontSize.lg,
    height: 48,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    color: colors.text,
  },
  multiLineTextInputBox: {
    fontSize: fontSize.lg,
    height: 160,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    backgroundColor: colors.background,
    color: colors.text,
  },
  booleanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: spacing.sm,
  },
  booleanValue: {
    marginLeft: spacing.md,
    fontSize: fontSize.xl,
    minWidth: 50,
    color: colors.text,
  },
  hint: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  camera: {
    height: 400,
  },
  imagePreview: {
    borderRadius: borderRadius.md,
  },
  previewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  warning: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    fontStyle: 'italic',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  statusMessage: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
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
  multiselectRow: {
    width: '100%',
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  multiselectCheckbox: {
    flex: 0,
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.borderDark,
    backgroundColor: colors.surface,
    marginRight: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  multiselectCheckboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.textInverse,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  multiselectCheckboxText: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.text,
  },
  locationButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  locationEchoRow: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
    minHeight: 48,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
  },
  locationEchoText: {
    lineHeight: 24,
    fontSize: fontSize.base,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  navButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    minWidth: 100,
    alignItems: 'center',
  },
  navButtonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  navButtonText: {
    fontSize: fontSize.base,
    color: colors.textInverse,
    fontWeight: fontWeight.medium,
  },
  navButtonSecondaryText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  locationButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  locationButtonText: {
    fontSize: fontSize.base,
    color: colors.textInverse,
    fontWeight: fontWeight.medium,
  },
  photoButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  photoButtonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoButtonText: {
    fontSize: fontSize.base,
    color: colors.textInverse,
    fontWeight: fontWeight.medium,
  },
  photoButtonSecondaryText: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
});
