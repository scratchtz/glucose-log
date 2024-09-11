import {atomWithMMKV} from './atom-mmkv';
import {StorageKeys} from '@/constants/storageKeys';

export type DefaultDataUnit = 'mmol' | 'mg';

export const dataUnitAtom = atomWithMMKV<DefaultDataUnit>(StorageKeys.KEY_DEFAULT_UNIT, 'mg');
