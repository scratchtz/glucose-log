import {atomWithMMKV} from './atom-mmkv';
import {StorageKeys} from '@/constants/storageKeys';
import {useAtomValue} from 'jotai/index';

export type DefaultLanguage = 'en' | 'sw' | 'kr';

export const languageAtom = atomWithMMKV<DefaultLanguage>(StorageKeys.KEY_LANGUAGE, 'en');
