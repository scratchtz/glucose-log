import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {Home} from '@/screens/Home/Home';
import {useMemo} from 'react';
import {UnistylesRuntime, useInitialTheme, useStyles} from 'react-native-unistyles';
import {Summary} from '@/screens/Summary/Summary';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Settings} from '@/screens/Settings/Settings';
import {getDefaultTheme} from '@/storage/theme';

const Stack = createNativeStackNavigator();

export default function Navigation() {
    const defaultTheme = getDefaultTheme();
    if (defaultTheme === 'system') {
        UnistylesRuntime.setAdaptiveThemes(true);
    }
    useInitialTheme(defaultTheme);

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
                        headerBackTitleVisible: false,
                        headerStyle: {backgroundColor: theme.colors.background},
                        headerTintColor: theme.colors.text.primary,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
