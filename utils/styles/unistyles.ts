import {lightTheme, darkTheme} from '@/utils/styles/theme';
import {breakpoints} from '@/utils/styles/breakpoints';

type AppThemes = {
    light: typeof lightTheme;
    dark: typeof darkTheme;
};
type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
    export interface UnistylesThemes extends AppThemes {}
    export interface UnistylesBreakpoints extends AppBreakpoints {}
}
