import EncryptedStorage from 'react-native-encrypted-storage';

const encryptionKey = 'glucose-log-key';

const storeEncryptionKey = (key: string) => {
    return EncryptedStorage.setItem(encryptionKey, key);
};

const getEncryptionKey = () => {
    return EncryptedStorage.getItem(encryptionKey);
};

const deleteEncryptionKey = () => {
    return EncryptedStorage.removeItem(encryptionKey);
};

export default {
    storeEncryptionKey,
    getEncryptionKey,
    deleteEncryptionKey,
};
