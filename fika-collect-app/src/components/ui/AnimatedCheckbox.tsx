import React from 'react';
import {StyleSheet, Text, Pressable} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import {colors, spacing, fontSize, fontWeight, borderRadius} from '../../theme';

interface AnimatedCheckboxProps {
  checked: boolean;
  onPress: () => void;
  label: string;
}

const springConfig = {
  damping: 15,
  stiffness: 400,
};

export default function AnimatedCheckbox({
  checked,
  onPress,
  label,
}: AnimatedCheckboxProps) {
  const checkboxStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      checked ? 1 : 0,
      [0, 1],
      [colors.surface, colors.primary],
    );
    const borderColor = interpolateColor(
      checked ? 1 : 0,
      [0, 1],
      [colors.borderDark, colors.primary],
    );

    return {
      backgroundColor,
      borderColor,
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: withSpring(checked ? 1 : 0, springConfig),
    transform: [{scale: withSpring(checked ? 1 : 0.5, springConfig)}],
  }));

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      accessibilityRole="checkbox"
      accessibilityState={{checked}}>
      <Animated.View style={[styles.checkbox, checkboxStyle]}>
        <Animated.Text style={[styles.checkmark, checkmarkStyle]}>
          ✓
        </Animated.Text>
      </Animated.View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
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
  containerPressed: {
    backgroundColor: colors.surfacePressed,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: colors.textInverse,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  label: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.text,
  },
});
