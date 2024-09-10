import {Alert, ScrollView, TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {useDataUnit} from '@/storage/atoms/unit';
import {useDataRange} from '@/storage/atoms/range';
import {useCallback, useRef} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {DataRange} from '@/screens/Settings/components/DataRange';
import {DataUnit} from '@/screens/Settings/components/DataUnit';
import {AppTheme} from '@/screens/Settings/components/AppTheme';
import DB from '@/storage/db-service';
import {UnitLabels} from '@/screens/Home/constants';
import {useMMKVString} from 'react-native-mmkv';
import {StorageKeys} from '@/constants/storageKeys';
import {encryptedStorage} from '@/storage/mmkv';

export function Settings() {
    const {styles, theme} = useStyles(stylesheet);
    const [savedTheme] = useMMKVString(StorageKeys.KEY_APP_THEME, encryptedStorage);

    const rangeRef = useRef<BottomSheetModal>(null);
    const unitRef = useRef<BottomSheetModal>(null);
    const themeRef = useRef<BottomSheetModal>(null);

    const handleRange = useCallback(() => {
        rangeRef.current?.present();
    }, []);

    const handleUnit = useCallback(() => {
        unitRef.current?.present();
    }, []);

    const handleTheme = useCallback(() => {
        themeRef.current?.present();
    }, []);

    const unit = useDataUnit();
    const {maxVal, minVal} = useDataRange();

    function clearAll() {
        const db = DB.getInstance();
        db.clearAll();
    }

    function onReset() {
        Alert.alert(
            'Reset All Data',
            'Your data will be deleted from your device, this is irreversible, there’s no way to recover your data as it’s only stored on this device',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {text: 'Delete', style: 'destructive', onPress: () => clearAll()},
            ],
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.wrapper}>
                <TouchableOpacity onPress={handleUnit} style={styles.setting}>
                    <Text weight={'500'}>Default unit </Text>
                    <Text weight={'500'}>{UnitLabels[unit]}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRange} style={styles.setting}>
                    <Text weight={'500'}>Range</Text>
                    <Text weight={'500'}>
                        {minVal} - {maxVal}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleTheme} style={styles.setting}>
                    <Text weight={'500'}>Theme</Text>
                    <Text weight={'500'}>{savedTheme}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onReset} style={[styles.setting, {borderBottomWidth: 0}]}>
                    <Text>Reset data</Text>
                </TouchableOpacity>
            </View>
            <View style={{marginTop: theme.spacing.m}}></View>
            <View style={styles.wrapper}>
                <View style={styles.setting}>
                    <Text>About us</Text>
                </View>
                <View style={styles.setting}>
                    <Text>Privacy policy</Text>
                </View>
                <View style={styles.setting}>
                    <Text>Terms and conditions</Text>
                </View>
                <View style={styles.setting}>
                    <Text>App version</Text>
                    <Text weight={'500'}>1.1</Text>
                </View>
                <View style={[styles.setting, {borderBottomWidth: 0}]}>
                    <Text>Github</Text>
                </View>
            </View>
            <DataRange ref={rangeRef} />
            <DataUnit ref={unitRef} />
            <AppTheme ref={themeRef} />
        </ScrollView>
    );
}

const stylesheet = createStyleSheet(theme => ({
    container: {
        paddingHorizontal: theme.spacing.th,
        paddingVertical: theme.spacing.l,
        flex: 1,
    },
    wrapper: {
        backgroundColor: theme.card.background,
        borderRadius: theme.rounded.l,
        padding: theme.spacing.m,
        gap: theme.spacing.m,
        marginTop: theme.spacing.s,
    },
    setting: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: theme.card.border,
        padding: theme.spacing.m,
    },
}));
