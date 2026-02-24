import {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Dimensions,
} from 'react-native';
import {useLocalization} from '../hooks/useLocalization';

import {
  Camera,
  useCameraPermission,
  useLocationPermission,
} from 'react-native-vision-camera';
import {type CameraDevice, type PhotoFile} from 'react-native-vision-camera';
import BlastedImage from 'react-native-blasted-image';
import {colors, spacing, fontSize, fontWeight, borderRadius} from '../theme';

interface ConfirmPhotoProps {
  file: PhotoFile;
  onConfirm: () => void;
  onRetake: () => void;
}

function StyledButton({
  title,
  onPress,
  variant = 'default',
}: {
  title: string;
  onPress: () => void;
  variant?: 'default' | 'primary';
}) {
  return (
    <Pressable
      accessibilityLabel={title}
      onPress={onPress}
      style={({pressed}) => [
        styles.styledButton,
        variant === 'primary' && styles.styledButtonPrimary,
        pressed && styles.styledButtonPressed,
      ]}>
      <Text
        style={[
          styles.styledButtonText,
          variant === 'primary' && styles.styledButtonTextPrimary,
        ]}>
        {title}
      </Text>
    </Pressable>
  );
}

function ConfirmPhoto({file, onConfirm, onRetake}: ConfirmPhotoProps) {
  const {getString} = useLocalization();
  return (
    <SafeAreaView style={styles.cameraContainer}>
      <View style={styles.topRow} />
      <BlastedImage
        source={{uri: pathFromFile(file)}}
        width={Dimensions.get('window').width}
        height={Dimensions.get('window').width * 1.4}
        style={styles.camera}
        resizeMode="contain"
      />
      <View style={styles.bottomRow}>
        <View style={styles.captureRowLeft}>
          <StyledButton title={getString('retakePhotoButton')} onPress={onRetake} />
        </View>
        <View style={styles.captureRowRight}>
          <StyledButton
            title={getString('usePhotoButton')}
            onPress={onConfirm}
            variant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

interface CameraControllerProps {
  device: CameraDevice | undefined;
  cancel: () => void;
  onCapture: (path: string) => void;
}

function pathFromFile(file: PhotoFile) {
  let path = file.path;
  if (!path.startsWith('file://')) {
    path = 'file://' + path;
  }
  return path;
}

export default function CameraController({
  device,
  cancel,
  onCapture,
}: CameraControllerProps) {
  const camera = useRef<Camera>(null);
  const [file, setFile] = useState<PhotoFile | null>(null);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const {hasPermission, requestPermission} = useCameraPermission();

  const [locationPermissionRequested, setLocationPermissionRequested] =
    useState(false);
  const {
    hasPermission: hasLocationPermission,
    requestPermission: requestLocationPermission,
  } = useLocationPermission();

  useEffect(() => {
    if (!hasPermission && !permissionRequested) {
      setPermissionRequested(true);
      requestPermission().catch(() => {
        setPermissionDenied(true);
      });
    }
  }, [hasPermission, requestPermission, permissionRequested]);

  useEffect(() => {
    if (
      hasPermission &&
      !hasLocationPermission &&
      !locationPermissionRequested
    ) {
      setLocationPermissionRequested(true);
      requestLocationPermission();
    }
  }, [
    hasPermission,
    hasLocationPermission,
    requestLocationPermission,
    locationPermissionRequested,
  ]);

  if (!hasPermission) {
    if (permissionDenied) {
      return (
        <View style={[StyleSheet.absoluteFill, styles.errorContainer]}>
          <Text style={styles.errorMessage}>
            Permission to access camera was denied!
          </Text>
          <StyledButton title="Cancel" onPress={cancel} />
        </View>
      );
    } else {
      return <View />;
    }
  }
  if (!device) {
    return (
      <View style={[StyleSheet.absoluteFill, styles.errorContainer]}>
        <Text style={styles.errorMessage}>No camera available!</Text>
        <StyledButton title="Cancel" onPress={cancel} />
      </View>
    );
  }

  const capture = async () => {
    if (!camera.current) {return;}
    setFile(await camera.current.takePhoto());
  };

  const retake = () => setFile(null);
  const confirm = () => {
    if (!file) {return;}
    onCapture(pathFromFile(file));
  };

  if (file) {
    return <ConfirmPhoto file={file} onRetake={retake} onConfirm={confirm} />;
  }

  return (
    <SafeAreaView style={styles.cameraContainer}>
      <View style={styles.topRow} />
      <Camera
        enableLocation={hasLocationPermission}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
        ref={camera}
      />
      <View style={styles.bottomRow}>
        <View style={styles.captureRowLeft}>
          <StyledButton title="Cancel" onPress={cancel} />
        </View>
        <View style={styles.captureRowCenter}>
          <Pressable
            onPress={capture}
            style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}>
            <View style={styles.captureButtonOuter}>
              <View style={styles.captureButtonMiddle}>
                <View style={styles.captureButtonInner} />
              </View>
            </View>
          </Pressable>
        </View>
        <View style={styles.captureRowRight} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: spacing.lg,
  },
  errorMessage: {
    fontSize: fontSize['2xl'],
    color: colors.error,
    fontStyle: 'italic',
    marginBottom: spacing['2xl'],
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRow: {
    height: 80,
  },
  bottomRow: {
    height: 120,
    flexDirection: 'row',
  },
  captureButtonOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonMiddle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
  },
  captureRowLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureRowCenter: {
    flex: 0,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureRowRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  styledButtonPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  styledButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  styledButtonText: {
    color: '#fff',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
  },
  styledButtonTextPrimary: {
    color: colors.textInverse,
  },
});
