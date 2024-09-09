import {MMKV} from 'react-native-mmkv';

export let encryptedStorage: MMKV;
export const initEncryptedStorage = (encryptionKey: string) => {
    encryptedStorage = new MMKV({
        id: 'glucose-log-encrypted-store',
        encryptionKey: encryptionKey,
    });
};
