import {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  Pressable,
  Dimensions,
} from 'react-native';

import {Camera} from 'react-native-vision-camera';
import {type CameraDevice, type PhotoFile} from 'react-native-vision-camera';
import BlastedImage from 'react-native-blasted-image';

interface ConfirmPhotoProps {
  file: PhotoFile;
  onConfirm: () => void;
  onRetake: () => void;
}

function ConfirmPhoto({file, onConfirm, onRetake}: ConfirmPhotoProps) {
  return (
    <SafeAreaView style={styles.cameraContainer}>
      <View style={styles.topRow}></View>
      <BlastedImage
        source={{uri: file.path}}
        width={Dimensions.get('window').width}
        height={Dimensions.get('window').width * 1.4}
        style={styles.camera}
        resizeMode="contain"
      />
      <View style={styles.bottomRow}>
        <View style={styles.captureRowLeft}>
          <Button title="Retake" onPress={onRetake} color="white" />
        </View>
        <View style={styles.captureRowRight}>
          <Button title="Use photo" onPress={onConfirm} color="white" />
        </View>
      </View>
    </SafeAreaView>
  );
}

interface CameraControllerProps {
  device: CameraDevice | undefined;
  cancel: () => void;
  onCapture: (file: PhotoFile) => void;
}

export default function CameraController({
  device,
  cancel,
  onCapture,
}: CameraControllerProps) {
  const camera = useRef<Camera>(null);
  const [file, setFile] = useState<PhotoFile | null>(null);

  if (!device) {
    return (
      <View style={[StyleSheet.absoluteFill, styles.errorContainer]}>
        <Text style={styles.errorMessage}>No camera available!</Text>
        <Button title="Cancel" onPress={cancel} />
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
    onCapture(file);
  };

  if (file) {
    return <ConfirmPhoto file={file} onRetake={retake} onConfirm={confirm} />;
  }

  return (
    <SafeAreaView style={styles.cameraContainer}>
      <View style={styles.topRow}></View>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
        ref={camera}
      />
      <View style={styles.bottomRow}>
        <View style={styles.captureRowLeft}>
          <Button title="Cancel" onPress={cancel} color="white" />
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
