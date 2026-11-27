/**
 * Shared color & theme constants for Canvas 2D, PixiJS, Phaser, and Three.js games.
 * Mirrors styles/tokens.css (sourced from HSC-QuestionBanks/frontend).
 */
export const THEME_COLORS = {
  bookpurple: '#3c1053',
  bookpurpleHover: '#4e186a',
  bookred: '#f2120c',
  lawpurple: '#b51825',
  warmstone: '#918b83',
  deepcharcoal: '#302c2a',
  softivory: '#f2efeb',
  bookwhite: '#ffffff',
  bookblack: '#000000',
} as const;

export const SEMANTIC_THEME = {
  pageBg: THEME_COLORS.softivory,
  surfaceBg: THEME_COLORS.bookwhite,
  frameBorder: THEME_COLORS.warmstone,
  textPrimary: THEME_COLORS.deepcharcoal,
  accentPrimary: THEME_COLORS.bookpurple,
  accentSecondary: THEME_COLORS.lawpurple,
  accentDanger: THEME_COLORS.bookred,
} as const;
