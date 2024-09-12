import {atomWithMMKV} from './atom-mmkv';
import {StorageKeys} from '@/constants/storageKeys';

export interface DataRange {
    minVal: number;
    maxVal: number;
}

export const dataRangeAtom = atomWithMMKV<DataRange>(StorageKeys.KEY_DATA_RANGE, {minVal: 80, maxVal: 180});
