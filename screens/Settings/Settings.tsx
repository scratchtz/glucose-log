import {Alert, Linking, ScrollView, TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {dataRangeAtom} from '@/storage/atoms/range';
import {useCallback, useRef} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {DataRange} from '@/screens/Settings/components/DataRange';
import {DataUnit} from '@/screens/Settings/components/DataUnit';
import {AppTheme} from '@/screens/Settings/components/AppTheme';
import DB from '@/storage/db-service';
import {useMMKVString} from 'react-native-mmkv';
import {StorageKeys} from '@/constants/storageKeys';
import {encryptedStorage} from '@/storage/mmkv';
import {useAtomValue} from 'jotai/index';
import {dataUnitAtom} from '@/storage/atoms/unit';
import {useTranslation} from 'react-i18next';
import {Language} from '@/screens/Settings/components/Language';
import DeviceInfo from 'react-native-device-info';
import Svg, {Path} from 'react-native-svg';

export function Settings({navigation}: any) {
    const {styles, theme} = useStyles(stylesheet);
    const [savedTheme] = useMMKVString(StorageKeys.KEY_APP_THEME, encryptedStorage);
    const [language] = useMMKVString(StorageKeys.KEY_LANGUAGE, encryptedStorage);
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
        Alert.alert(`${t('settings.reset_data')}`, `${t('settings.reset_data_desc')}`, [
            {
                text: `${t('settings.cancel')}`,
                style: 'cancel',
            },
            {text: `${t('settings.delete')}`, style: 'destructive', onPress: () => clearAll()},
        ]);
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.wrapper}>
                <TouchableOpacity onPress={handleUnit} style={styles.setting}>
                    <Text weight={'500'}>{t('settings.default_unit')} </Text>
                    <Text weight={'500'}>{t(`constants.unit.${unit}`)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRange} style={styles.setting}>
                    <Text weight={'500'}>{t('settings.range')}</Text>
                    <Text weight={'500'}>
                        {unit === 'mmol' ? (minVal / 18).toFixed(2) : minVal} -
                        {unit === 'mmol' ? (maxVal / 18).toFixed(2) : maxVal} {t(`constants.unit.${unit}`)}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleTheme} style={styles.setting}>
                    <Text weight={'500'}>{t('settings.theme')}</Text>
                    <Text weight={'500'}>{t(`constants.theme.${savedTheme || 'system'}`)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLanguage} style={styles.setting}>
                    <Text weight={'500'}>{t('settings.language')}</Text>
                    <Text weight={'500'}>{t(`constants.language.${language || 'en'}`)}</Text>
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
                <TouchableOpacity
                    onPress={() => navigation.navigate('Terms')}
                    style={[
                        styles.setting,
                        {
                            borderBottomWidth: 0,
                        },
                    ]}>
                    <Text>{t('settings.terms')}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <View>
                    <Text style={styles.appVersion}>
                        v{DeviceInfo.getVersion()} build {DeviceInfo.getBuildNumber()}
                    </Text>
                </View>
                <TouchableOpacity onPress={openGithub} style={styles.githubWrap}>
                    <Svg viewBox="0 0 24 24" style={{width: 20, height: 20}}>
                        <Path
                            fill={theme.colors.text.secondary}
                            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                        />
                    </Svg>
                    <Text style={styles.github}>Github</Text>
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
    footer: {
        alignItems: 'center',
        marginTop: theme.spacing.xl,
    },
    githubWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        marginTop: theme.spacing.m,
    },
    appVersion: {
        fontFamily: 'Font-400',
        color: theme.colors.text.secondary,
        fontSize: 13,
    },
    github: {
        textDecorationLine: 'underline',
        color: theme.colors.text.secondary,
    },
}));
