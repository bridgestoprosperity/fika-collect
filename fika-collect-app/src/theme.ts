/**
 * Design tokens for Fika Collect app
 * Centralized theme constants for consistent styling
 */

export const colors = {
  // Primary brand colors
  primary: '#367845',
  primaryPressed: '#2E7D32',
  primaryLight: '#E8F5E9',

  // Backgrounds
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfacePressed: '#F5F5F5',

  // Text colors
  text: '#212121',
  textSecondary: '#757575',
  textHint: '#9E9E9E',
  textInverse: '#FFFFFF',

  // Borders
  border: '#E0E0E0',
  borderDark: '#BDBDBD',

  // Semantic colors
  error: '#D32F2F',
  errorPressed: '#B71C1C',
  errorLight: '#FFEBEE',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  success: '#4CAF50',
  link: '#2196F3',

  // Legacy/specific use
  overlay: 'rgba(0, 0, 0, 0.5)',
  transparent: 'transparent',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 22,
  '3xl': 24,
};

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const lineHeight = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};
