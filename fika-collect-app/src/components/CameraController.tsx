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

interface ConfirmPhotoProps {
  file: PhotoFile;
  onConfirm: () => void;
  onRetake: () => void;
}

function StyledButton({
  title,
  onPress,
  color = 'white',
  backgroundColor = 'black',
}: {
  title: string;
  onPress: () => void;
  color?: string;
  backgroundColor?: string;
}) {
  return (
    <Pressable
      accessibilityLabel={title}
      onPress={onPress}
      style={({pressed}) => [
        {
          backgroundColor: pressed ? 'gray' : backgroundColor,
          padding: 10,
          borderRadius: 5,
        },
      ]}>
      <Text style={{color, fontSize: 18}}>{title}</Text>
    </Pressable>
  );
}

function ConfirmPhoto({file, onConfirm, onRetake}: ConfirmPhotoProps) {
  const {getString} = useLocalization();
  return (
    <SafeAreaView style={styles.cameraContainer}>
      <View style={styles.topRow}></View>
      <BlastedImage
        source={{uri: pathFromFile(file)}}
        width={Dimensions.get('window').width}
        height={Dimensions.get('window').width * 1.4}
        style={styles.camera}
        resizeMode="contain"
      />
      <View style={styles.bottomRow}>
        <View style={styles.captureRowLeft}>
          <StyledButton
            title={getString('retakePhotoButton')}
            onPress={onRetake}
            color="white"
          />
        </View>
        <View style={styles.captureRowRight}>
          <StyledButton
            title={getString('usePhotoButton')}
            onPress={onConfirm}
            color="white"
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
    if (!camera.current) return;
    setFile(await camera.current.takePhoto());
    //onCapture && onCapture(await camera.current.takePhoto());
  };

  const retake = () => setFile(null);
  const confirm = () => {
    if (!file) return;
    onCapture(pathFromFile(file));
  };

  if (file) {
    return <ConfirmPhoto file={file} onRetake={retake} onConfirm={confirm} />;
  }

  return (
    <SafeAreaView style={styles.cameraContainer}>
      <View style={styles.topRow}></View>
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
          <StyledButton title="Cancel" onPress={cancel} color="white" />
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
  },
  errorMessage: {
    fontSize: 22,
    color: 'red',
    fontStyle: 'italic',
    marginBottom: 50,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    color: 'white',
    fontSize: 22,
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
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonMiddle: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 55,
    height: 55,
    borderRadius: 50,
    backgroundColor: 'white',
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
});
