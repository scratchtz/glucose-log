import {StorageKeys} from '@/constants/storageKeys';
import {encryptedStorage} from '@/storage/mmkv';

export type Theme = 'light' | 'dark' | 'system';

export function getDefaultTheme(): Theme {
    const themeString = encryptedStorage.getString(StorageKeys.KEY_APP_THEME);
    return themeString as Theme;
}

export function setDefaultTheme(theme: Theme) {
    encryptedStorage.set(StorageKeys.KEY_APP_THEME, theme);
}
