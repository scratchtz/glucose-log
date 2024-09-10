import {useMemo} from 'react';
import {useColorScheme} from 'react-native';
import {getDefaultTheme} from '@/storage/theme';
import {UnistylesRuntime, UnistylesThemes} from 'react-native-unistyles';

type AppTheme = keyof UnistylesThemes;
type StoredTheme = AppTheme | 'system';

export function useAppTheme(): AppTheme {
    const systemTheme = useColorScheme();
    const storedTheme = getDefaultTheme() as StoredTheme;

    return useMemo<AppTheme>(() => {
        if (storedTheme === 'system') {
            UnistylesRuntime.setAdaptiveThemes(true);
            return (systemTheme === 'dark' ? 'dark' : 'light') as AppTheme;
        }
        return storedTheme as AppTheme;
    }, [systemTheme, storedTheme]);
}
