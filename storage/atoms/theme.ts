import {atomWithMMKV} from './atom-mmkv';
import {getDefaultStore, useAtomValue} from 'jotai/index';
import {StorageKeys} from '@/constants/storageKeys';

export type DefaultTheme = 'light' | 'dark';

const appThemeAtom = atomWithMMKV<DefaultTheme>(StorageKeys.KEY_APP_THEME, 'dark');

export function useDefaultTheme(): DefaultTheme {
    return useAtomValue(appThemeAtom);
}

export function setDefaultTheme(theme: DefaultTheme) {
    getDefaultStore().set(appThemeAtom, theme);
}
