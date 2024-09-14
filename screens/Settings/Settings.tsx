import {Alert, Linking, ScrollView, TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, UnistylesRuntime, useStyles} from 'react-native-unistyles';
import {dataRangeAtom} from '@/storage/atoms/range';
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
import {useAtomValue} from 'jotai/index';
import {dataUnitAtom} from '@/storage/atoms/unit';
import {useTranslation} from 'react-i18next';
import {Language} from '@/screens/Settings/components/Language';
import {languageAtom} from '@/storage/atoms/language';

export function Settings({navigation}: any) {
    const {styles, theme} = useStyles(stylesheet);
    const [savedTheme] = useMMKVString(StorageKeys.KEY_APP_THEME, encryptedStorage);
    const {t} = useTranslation();

    const rangeRef = useRef<BottomSheetModal>(null);
    const unitRef = useRef<BottomSheetModal>(null);
    const themeRef = useRef<BottomSheetModal>(null);
    const langRef = useRef<BottomSheetModal>(null);

    const handleRange = useCallback(() => {
        rangeRef.current?.present();
    }, []);

    const handleUnit = useCallback(() => {
        unitRef.current?.present();
    }, []);

    const handleTheme = useCallback(() => {
        themeRef.current?.present();
    }, []);

    const handleLanguage = useCallback(() => {
        langRef.current?.present();
    }, []);

    const unit = useAtomValue(dataUnitAtom);
    const {maxVal, minVal} = useAtomValue(dataRangeAtom);
    const language = useAtomValue(languageAtom);

    function clearAll() {
        const db = DB.getInstance();
        db.clearAll();
    }

    const openGithub = async () => {
        const url = 'https://github.com/scratchtz/glucose-log';
        try {
            await Linking.openURL(url);
        } catch (error) {
            console.error('An error occurred while opening the URL', error);
        }
    };

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
                    <Text weight={'500'}>{t('settings.default_unit')} </Text>
                    <Text weight={'500'}>{UnitLabels[unit]}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRange} style={styles.setting}>
                    <Text weight={'500'}>{t('settings.range')}</Text>
                    <Text weight={'500'}>
                        {unit === 'mmol' ? (minVal / 18).toFixed(2) : minVal} -
                        {unit === 'mmol' ? (maxVal / 18).toFixed(2) : maxVal} {UnitLabels[unit]}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleTheme} style={styles.setting}>
                    <Text weight={'500'}>{t('settings.theme')}</Text>
                    <Text weight={'500'}>{t(`settings.${savedTheme}`)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLanguage} style={styles.setting}>
                    <Text weight={'500'}>{t('settings.language')}</Text>
                    <Text weight={'500'}>{t(`settings.${language}`)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onReset} style={[styles.setting, {borderBottomWidth: 0}]}>
                    <Text>{t('settings.reset_data')}</Text>
                </TouchableOpacity>
            </View>
            <View style={{marginTop: theme.spacing.m}}></View>
            <View style={styles.wrapper}>
                <TouchableOpacity onPress={() => navigation.navigate('About')} style={styles.setting}>
                    <Text>{t('settings.about_us')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Policy')} style={styles.setting}>
                    <Text>{t('settings.privacy_policy')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Terms')} style={styles.setting}>
                    <Text>{t('settings.terms')}</Text>
                </TouchableOpacity>
                <View style={styles.setting}>
                    <Text>{t('settings.app_version')}</Text>
                    <Text weight={'500'}>1.1</Text>
                </View>
                <TouchableOpacity onPress={openGithub} style={[styles.setting, {borderBottomWidth: 0}]}>
                    <Text>{t('settings.github')}</Text>
                </TouchableOpacity>
            </View>
            <DataRange ref={rangeRef} />
            <DataUnit ref={unitRef} />
            <AppTheme ref={themeRef} />
            <Language ref={langRef} />
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
