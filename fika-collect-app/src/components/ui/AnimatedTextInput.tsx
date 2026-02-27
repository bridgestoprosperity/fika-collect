import React, {useState, forwardRef} from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import {colors, spacing, fontSize, borderRadius} from '../../theme';

interface AnimatedTextInputProps extends TextInputProps {
  multiline?: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const AnimatedTextInput = forwardRef<TextInput, AnimatedTextInputProps>(
  ({multiline = false, style, onFocus, onBlur, ...props}, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const containerStyle = useAnimatedStyle(() => {
      const borderColor = interpolateColor(
        isFocused ? 1 : 0,
        [0, 1],
        [colors.border, colors.primary],
      );

      return {
        borderColor,
        borderWidth: withTiming(isFocused ? 2 : 1, {duration: 150}),
      };
    });

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <AnimatedView
        style={[
          styles.container,
          multiline && styles.multilineContainer,
          containerStyle,
        ]}>
        <TextInput
          ref={ref}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            style,
          ]}
          placeholderTextColor={colors.textHint}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />
      </AnimatedView>
    );
  },
);

AnimatedTextInput.displayName = 'AnimatedTextInput';

export default AnimatedTextInput;

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  multilineContainer: {
    minHeight: 160,
  },
  input: {
    fontSize: fontSize.lg,
    height: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
  },
  multilineInput: {
    height: 'auto',
    minHeight: 140,
    padding: spacing.md,
  },
});
