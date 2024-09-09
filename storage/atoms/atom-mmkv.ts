import {atomWithStorage, createJSONStorage} from 'jotai/utils';
import {encryptedStorage} from '@/storage/mmkv';

function getItem(key: string): string | null {
    const value = encryptedStorage.getString(key);
    return value ? value : null;
}

function setItem(key: string, value: string): void {
    encryptedStorage.set(key, value);
}

function removeItem(key: string): void {
    encryptedStorage.delete(key);
}

function clearAll(): void {
    encryptedStorage.clearAll();
}

export const atomWithMMKV = <T>(key: string, initialValue: T) =>
    atomWithStorage<T>(
        key,
        initialValue,
        createJSONStorage<T>(() => ({
            getItem,
            setItem,
            removeItem,
            clearAll,
        })),
    );
