export const colors = {
  bg: '#0A0A0A',
  surface: '#141414',
  surfaceElevated: '#1C1C1C',
  border: '#2A2A2A',
  borderActive: '#3A3A3A',

  accent: '#E8FF3C',       // Neon yellow-green
  accentDim: '#B8CC2E',
  accentFaint: 'rgba(232,255,60,0.08)',

  text: '#F0F0F0',
  textSecondary: '#888888',
  textMuted: '#555555',

  priorityLow: '#4ADE80',
  priorityMedium: '#FACC15',
  priorityHigh: '#F87171',

  success: '#4ADE80',
  danger: '#F87171',
  dangerFaint: 'rgba(248,113,113,0.10)',
};

export const typography = {
  fontDisplay: 'monospace' as const,   // will be overridden by expo-font if loaded
  fontBody: 'System' as const,

  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 26,
    '2xl': 34,
  },

  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 18,
  full: 999,
};
