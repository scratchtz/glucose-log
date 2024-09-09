import {atomWithMMKV} from './atom-mmkv';
import {getDefaultStore, useAtomValue} from 'jotai/index';
import {StorageKeys} from '@/constants/storageKeys';

export type DefaultDataUnit = 'mmol' | 'mg';

const dataUnitAtom = atomWithMMKV<DefaultDataUnit>(StorageKeys.KEY_DEFAULT_UNIT, 'mg');

export function useDataUnit(): DefaultDataUnit {
    return useAtomValue(dataUnitAtom);
}

export function setDataUnit(unit: DefaultDataUnit) {
    getDefaultStore().set(dataUnitAtom, unit);
}
