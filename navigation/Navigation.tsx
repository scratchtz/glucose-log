import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {Home} from '@/screens/Home/Home';
import {useEffect, useMemo} from 'react';
import {UnistylesRuntime, useStyles} from 'react-native-unistyles';
import {Summary} from '@/screens/Summary/Summary';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Settings} from '@/screens/Settings/Settings';
import {useMMKVString} from 'react-native-mmkv';
import {StorageKeys} from '@/constants/storageKeys';
import {encryptedStorage} from '@/storage/mmkv';
import {AboutUs} from '@/screens/Settings/components/about-us';
import {Terms} from '@/screens/Settings/components/terms';
import {PrivacyPolicy} from '@/screens/Settings/components/privacy-policy';
import {useTranslation} from 'react-i18next';
import i18n from 'i18next';

const Stack = createNativeStackNavigator();

export default function Navigation() {
    const [savedTheme] = useMMKVString(StorageKeys.KEY_APP_THEME, encryptedStorage);
    const {t} = useTranslation();

    useEffect(() => {
        if (!savedTheme || savedTheme === 'system') {
            UnistylesRuntime.setAdaptiveThemes(true);
            return;
        }
        UnistylesRuntime.setAdaptiveThemes(false);
        UnistylesRuntime.setTheme(savedTheme as 'light' | 'dark');
    }, [savedTheme]);

    const [savedLanguage] = useMMKVString(StorageKeys.KEY_LANGUAGE, encryptedStorage);
    useEffect(() => {
        if (!savedLanguage) {
            void i18n.changeLanguage('en');
            return;
        }
        void i18n.changeLanguage(savedLanguage);
    }, [savedLanguage]);

    const {theme} = useStyles();
    const navigationTheme = useMemo(
        () => ({
            dark: theme.id === 'dark',
            colors: {
                ...DefaultTheme.colors,
                background: theme.colors.background,
                border: theme.colors.border,
                text: theme.colors.text.primary,
            },
        }),
        [theme.id],
    );

    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{
                        title: 'Home',
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Summary"
                    component={Summary}
                    options={{
                        title: `${t('summary.title')}`,
                        headerBackTitleVisible: false,
                        headerStyle: {backgroundColor: theme.colors.background},
                        headerTintColor: theme.colors.text.primary,
                    }}
                />
                <Stack.Screen
                    name="Settings"
                    component={Settings}
                    options={{
                        title: `${t('settings.title')}`,
                        headerBackTitleVisible: false,
                        headerStyle: {backgroundColor: theme.colors.background},
                        headerTintColor: theme.colors.text.primary,
                    }}
                />
                <Stack.Screen
                    name="About"
                    component={AboutUs}
                    options={{
                        title: `${t('about_us.title')}`,
                        headerBackTitleVisible: false,
                        presentation: 'modal',
                        headerStyle: {backgroundColor: theme.colors.background},
                        headerTintColor: theme.colors.text.primary,
                    }}
                />
                <Stack.Screen
                    name="Terms"
                    component={Terms}
                    options={{
                        title: `${t('terms.title')}`,
                        headerBackTitleVisible: false,
                        presentation: 'modal',
                        headerStyle: {backgroundColor: theme.colors.background},
                        headerTintColor: theme.colors.text.primary,
                    }}
                />
                <Stack.Screen
                    name="Policy"
                    component={PrivacyPolicy}
                    options={{
                        title: `${t('privacy.title')}`,
                        headerBackTitleVisible: false,
                        presentation: 'modal',
                        headerStyle: {backgroundColor: theme.colors.background},
                        headerTintColor: theme.colors.text.primary,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
