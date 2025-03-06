import {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  Pressable,
} from 'react-native';

import {Camera} from 'react-native-vision-camera';
import {type CameraDevice} from 'react-native-vision-camera';

interface CameraControllerProps {
  device: CameraDevice | undefined;
  cancel: () => void;
}

export default function CameraController({
  device,
  cancel,
}: CameraControllerProps) {
  if (!device) {
    return (
      <View style={[StyleSheet.absoluteFill, styles.errorContainer]}>
        <Text style={styles.errorMessage}>No camera available!</Text>
        <Button title="Cancel" onPress={cancel} />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.cameraContainer}>
      <View style={styles.topRow}></View>
      <Camera style={styles.camera} device={device} isActive={true} />
      <View style={styles.bottomRow}>
        <View style={styles.captureRowLeft}>
          <Button title="Cancel" onPress={cancel} color="white" />
        </View>
        <View style={styles.captureRowCenter}>
          <Pressable style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}>
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
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    height: 200,
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
