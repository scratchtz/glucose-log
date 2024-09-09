import {atomWithMMKV} from './atom-mmkv';
import {getDefaultStore, useAtomValue} from 'jotai/index';
import {StorageKeys} from '@/constants/storageKeys';

export interface DataRange {
    minVal: number;
    maxVal: number;
}

const dataRangeAtom = atomWithMMKV<DataRange>(StorageKeys.KEY_DATA_RANGE, {minVal: 80, maxVal: 180});

export function useDataRange(): DataRange {
    return useAtomValue(dataRangeAtom);
}

export function setDataRange(range: DataRange) {
    getDefaultStore().set(dataRangeAtom, {minVal: range.minVal, maxVal: range.maxVal});
}
