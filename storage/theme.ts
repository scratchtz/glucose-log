import {StorageKeys} from '@/constants/storageKeys';
import {encryptedStorage} from '@/storage/mmkv';

export type Theme = 'light' | 'dark';

export function getDefaultTheme(): Theme {
    const themeString = encryptedStorage.getString(StorageKeys.KEY_APP_THEME);
    if (themeString === 'light' || themeString === 'dark') {
        return themeString as Theme;
    } else {
        return 'dark'; //sets to default
    }
}

export function setDefaultTheme(theme: Theme) {
    encryptedStorage.set(StorageKeys.KEY_APP_THEME, theme);
}
