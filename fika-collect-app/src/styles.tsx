import {StyleSheet, Platform} from 'react-native';
import {colors, spacing, fontSize, borderRadius} from './theme';

export default StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginLeft: spacing.sm,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonSecondaryText: {
    color: colors.primary,
  },
  buttonDanger: {
    backgroundColor: colors.error,
  },
  buttonDangerPressed: {
    backgroundColor: colors.errorPressed,
  },
  buttonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  buttonSecondaryPressed: {
    backgroundColor: colors.surfacePressed,
  },
  buttonText: {
    fontSize: fontSize.lg,
    color: colors.textInverse,
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  sectionHeaderContainer: {
    width: '100%',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  sectionHeaderText: {
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  picker: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    height: Platform.OS === 'android' ? 60 : 210,
    width: '100%',
    borderRadius: borderRadius.md,
  },
  pickerItem: {
    color: colors.text,
    fontSize: fontSize.base,
  },
});
