import React, {ReactNode} from 'react';
import {StyleSheet, ViewStyle, StyleProp} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {colors, spacing, borderRadius, shadows} from '../../theme';

interface AnimatedCardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const springConfig = {
  damping: 15,
  stiffness: 400,
};

export default function AnimatedCard({
  children,
  onPress,
  style,
  disabled = false,
}: AnimatedCardProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressed.value, [0, 1], [1, 0.98]);
    const elevation = interpolate(pressed.value, [0, 1], [2, 1]);

    return {
      transform: [{scale}],
      elevation,
      shadowOpacity: interpolate(pressed.value, [0, 1], [0.08, 0.04]),
    };
  });

  const tap = Gesture.Tap()
    .enabled(!disabled && !!onPress)
    .onBegin(() => {
      'worklet';
      pressed.value = withSpring(1, springConfig);
    })
    .onFinalize(() => {
      'worklet';
      pressed.value = withSpring(0, springConfig);
    })
    .onEnd(() => {
      'worklet';
      if (onPress) {
        runOnJS(onPress)();
      }
    });

  if (!onPress) {
    return (
      <Animated.View style={[styles.card, style]}>
        {children}
      </Animated.View>
    );
  }

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[styles.card, style, animatedStyle]}
        accessibilityRole="button">
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadows.md,
  },
});
