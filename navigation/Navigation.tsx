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

const Stack = createNativeStackNavigator();

export default function Navigation() {
    const [savedTheme] = useMMKVString(StorageKeys.KEY_APP_THEME, encryptedStorage);

    useEffect(() => {
        if (!savedTheme || savedTheme === 'system') {
            UnistylesRuntime.setAdaptiveThemes(true);
            return;
        }
        UnistylesRuntime.setAdaptiveThemes(false);
        UnistylesRuntime.setTheme(savedTheme as 'light' | 'dark');
    }, [savedTheme]);

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
                        title: 'Summary',
                        presentation: 'modal',
                        headerBackTitleVisible: false,
                        headerStyle: {backgroundColor: theme.colors.background},
                        headerTintColor: theme.colors.text.primary,
                    }}
                />
                <Stack.Screen
                    name="Settings"
                    component={Settings}
                    options={{
                        title: 'Settings',
                        presentation: 'modal',
                        headerBackTitleVisible: false,
                        headerStyle: {backgroundColor: theme.colors.background},
                        headerTintColor: theme.colors.text.primary,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
