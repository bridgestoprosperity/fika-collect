import React from 'react';
import {StyleSheet, Text, ActivityIndicator} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {colors, spacing, fontSize, fontWeight, borderRadius} from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
}

const springConfig = {
  damping: 15,
  stiffness: 400,
};

export default function AnimatedButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  accessibilityLabel,
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const tap = Gesture.Tap()
    .enabled(!disabled && !loading)
    .onBegin(() => {
      'worklet';
      scale.value = withSpring(0.97, springConfig);
    })
    .onFinalize(() => {
      'worklet';
      scale.value = withSpring(1, springConfig);
    })
    .onEnd(() => {
      'worklet';
      runOnJS(onPress)();
    });

  const variantStyles = getVariantStyles(variant);
  const isDisabled = disabled || loading;

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[
          styles.button,
          variantStyles.button,
          isDisabled && styles.disabled,
          animatedStyle,
        ]}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityRole="button"
        accessibilityState={{disabled: isDisabled}}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variantStyles.loaderColor}
          />
        ) : (
          <Text style={[styles.text, variantStyles.text]}>{title}</Text>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

function getVariantStyles(variant: ButtonVariant) {
  switch (variant) {
    case 'primary':
      return {
        button: styles.primaryButton,
        text: styles.primaryText,
        loaderColor: colors.textInverse,
      };
    case 'secondary':
      return {
        button: styles.secondaryButton,
        text: styles.secondaryText,
        loaderColor: colors.primary,
      };
    case 'danger':
      return {
        button: styles.dangerButton,
        text: styles.dangerText,
        loaderColor: colors.textInverse,
      };
    case 'ghost':
      return {
        button: styles.ghostButton,
        text: styles.ghostText,
        loaderColor: colors.textSecondary,
      };
  }
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    minHeight: 44,
  },
  text: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  disabled: {
    opacity: 0.5,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: colors.textInverse,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryText: {
    color: colors.textSecondary,
  },
  dangerButton: {
    backgroundColor: colors.error,
  },
  dangerText: {
    color: colors.textInverse,
  },
  ghostButton: {
    backgroundColor: colors.transparent,
  },
  ghostText: {
    color: colors.textSecondary,
  },
});
