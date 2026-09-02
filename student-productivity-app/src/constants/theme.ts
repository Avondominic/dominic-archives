import { Priority } from '../types';

/**
 * Restrained, dark, near-monochrome palette with a single accent hue —
 * deliberately not a bright "gamified app" rainbow. Rank colors provide
 * the only real color variation, so progression reads as meaningful.
 */
export const colors = {
  background: '#08080B',
  backgroundElevated: '#111116',
  surface: '#16161D',
  surfaceAlt: '#1C1C24',
  border: '#26262F',
  borderSubtle: '#1C1C22',

  textPrimary: '#EDEDF2',
  textSecondary: '#8E8E9A',
  textMuted: '#57575F',

  accent: '#6E6BFF',
  accentDim: '#403DB8',
  accentSoft: 'rgba(110, 107, 255, 0.14)',

  success: '#3DDC97',
  warning: '#E8A33D',
  danger: '#E8546B',
  gold: '#D4AF37',
};

export const priorityColors: Record<Priority, string> = {
  Low: '#5C9EE8',
  Medium: '#E8A33D',
  High: '#E8546B',
};

export const rankColors: Record<string, string> = {
  Noob: '#6B7280',
  'Avg Avg': '#5C9EE8',
  'Try Hard': '#3DDC97',
  Geek: '#B57EDC',
  Nerd: '#E8A33D',
  Einstein: '#D4AF37',
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
