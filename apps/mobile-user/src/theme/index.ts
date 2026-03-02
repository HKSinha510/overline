// Overline Design System - Theme & Constants
// Premium color palette inspired by modern fintech/booking apps

export const Colors = {
    // Primary brand colors
    primary: '#6C5CE7',
    primaryDark: '#5A4DD1',
    primaryLight: '#A29BFE',
    primaryGhost: 'rgba(108, 92, 231, 0.08)',
    primaryBorder: 'rgba(108, 92, 231, 0.2)',

    // Accent colors
    accent: '#00D2FF',
    accentDark: '#00B4D8',
    accentLight: '#90E0EF',

    // Semantic colors
    success: '#00C48C',
    successLight: 'rgba(0, 196, 140, 0.1)',
    warning: '#FFB830',
    warningLight: 'rgba(255, 184, 48, 0.1)',
    error: '#FF6B6B',
    errorLight: 'rgba(255, 107, 107, 0.1)',
    info: '#4ECDC4',

    // Neutral palette
    background: '#0D0D0F',
    surface: '#1A1A2E',
    surfaceLight: '#222240',
    surfaceElevated: '#2A2A4A',
    card: '#16213E',
    cardLight: '#1C2D50',

    // Text
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A3BD',
    textTertiary: '#6E7191',
    textMuted: '#4E4F6A',

    // Borders
    border: 'rgba(255, 255, 255, 0.06)',
    borderLight: 'rgba(255, 255, 255, 0.1)',
    borderActive: 'rgba(108, 92, 231, 0.4)',

    // Gradients (start, end)
    gradientPrimary: ['#6C5CE7', '#A855F7'],
    gradientAccent: ['#00D2FF', '#6C5CE7'],
    gradientSuccess: ['#00C48C', '#00D2FF'],
    gradientSurface: ['#1A1A2E', '#16213E'],
    gradientDark: ['#0D0D0F', '#1A1A2E'],

    // Overlays
    overlay: 'rgba(0, 0, 0, 0.6)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
    shimmer: 'rgba(255, 255, 255, 0.05)',
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
};

export const BorderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
};

export const FontSizes = {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    hero: 48,
};

export const FontWeights = {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
};

export const Shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#6C5CE7',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    glow: {
        shadowColor: '#6C5CE7',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
};

export const StatusBarStyle = 'light-content' as const;

// Booking status config
export const BookingStatusConfig: Record<string, { color: string; bg: string; icon: string }> = {
    PENDING: { color: '#FFB830', bg: 'rgba(255, 184, 48, 0.15)', icon: '⏳' },
    CONFIRMED: { color: '#00C48C', bg: 'rgba(0, 196, 140, 0.15)', icon: '✓' },
    IN_PROGRESS: { color: '#00D2FF', bg: 'rgba(0, 210, 255, 0.15)', icon: '▶' },
    COMPLETED: { color: '#00C48C', bg: 'rgba(0, 196, 140, 0.15)', icon: '✓' },
    CANCELLED: { color: '#FF6B6B', bg: 'rgba(255, 107, 107, 0.15)', icon: '✕' },
    NO_SHOW: { color: '#6E7191', bg: 'rgba(110, 113, 145, 0.15)', icon: '!' },
};
