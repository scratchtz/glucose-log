import {palette} from '@/utils/styles/palette';
import {rounded, spacing} from './constants';

export type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800';
export type FontColor = 'primary' | 'secondary' | 'tertiary';
export type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'tiny';

export type AppTheme = typeof lightTheme;
const primaryColor = palette.violet500;
export const lightTheme = {
    id: 'light',
    isDark: false,
    spacing: spacing,
    rounded: rounded,
    colors: {
        primary: primaryColor,
        text: {
            primary: palette.gray900,
            secondary: palette.gray600,
            tertiary: palette.gray400,
        },
        background: palette.gray100,
        border: palette.gray300,
    },
    card: {
        background: palette.white,
        border: palette.neutral200,
    },
    tab: {
        background: palette.gray50,
        border: palette.gray500,
    },
    text: {
        h1: {
            fontSize: 32,
            color: palette.gray900,
            fontFamily: 'Font-800',
        },
        h2: {
            fontSize: 24,
            color: palette.gray900,
            fontFamily: 'Font-600',
        },
        h3: {
            fontSize: 18,
            color: palette.gray900,
            fontFamily: 'Font-600',
        },
        body: {
            fontSize: 15,
            color: palette.gray900,
            fontFamily: 'Font-400',
        },
        small: {
            fontSize: 12,
            color: palette.gray900,
            fontFamily: 'Font-400',
        },
        tiny: {
            fontSize: 10,
            color: palette.gray900,
            fontFamily: 'Font-400',
        },
    },
};

export const darkTheme: AppTheme = {
    id: 'dark',
    isDark: true,
    spacing: spacing,
    rounded: rounded,
    colors: {
        primary: primaryColor,
        text: {
            primary: palette.gray100,
            secondary: palette.gray400,
            tertiary: palette.gray500,
        },
        background: '#151515',
        border: '#151515',
    },
    card: {
        background: '#2C323B',
        border: palette.neutral800,
    },
    tab: {
        background: '#151515',
        border: '#222222',
    },
    text: {
        h1: {
            fontSize: 32,
            color: palette.neutral100,
            fontFamily: 'Font-800',
        },
        h2: {
            fontSize: 24,
            color: palette.neutral100,
            fontFamily: 'Font-600',
        },
        h3: {
            fontSize: 18,
            color: palette.neutral100,
            fontFamily: 'Font-600',
        },
        body: {
            fontSize: 15,
            color: palette.neutral100,
            fontFamily: 'Font-400',
        },
        small: {
            fontSize: 12,
            color: palette.neutral100,
            fontFamily: 'Font-400',
        },
        tiny: {
            fontSize: 10,
            color: palette.neutral100,
            fontFamily: 'Font-400',
        },
    },
};
