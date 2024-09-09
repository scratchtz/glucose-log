import {useEffect, useState} from 'react';
import security from '@/storage/security';
import {initEncryptedStorage} from '@/storage/mmkv';
import {Buffer} from '@craftzdog/react-native-buffer';
import crypto from 'react-native-quick-crypto';

export function useEncryptionStorage() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        void loadKey();
    }, []);
    const loadKey = async () => {
        const encryptionKey = await security.getEncryptionKey();
        if (encryptionKey) {
            initEncryptedStorage(encryptionKey);
            setIsLoaded(true);
            return;
        }
        const randomKey = Buffer.from(crypto.randomBytes(16)).toString('hex');
        void security.storeEncryptionKey(randomKey);

        initEncryptedStorage(randomKey);
        setIsLoaded(true);
    };
    return [isLoaded];
}
