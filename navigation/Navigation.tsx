import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {Home} from '@/screens/Home/Home';
import {useMemo} from 'react';
import {useStyles} from 'react-native-unistyles';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Summary} from '@/screens/Summary/Summary';
import {AntDesign, Feather} from '@expo/vector-icons';

const Tabs = createBottomTabNavigator();

export default function Navigation() {
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

    const screenOptions = useMemo(
        () => ({
            tabBarStyle: {
                backgroundColor: theme.tab.background,
                borderTopColor: theme.tab.border,
            },
            tabBarActiveTintColor: theme.colors.text.primary,
            tabBarInactiveTintColor: theme.colors.text.tertiary,
        }),
        [theme.id],
    );

    return (
        <NavigationContainer theme={navigationTheme}>
            <Tabs.Navigator screenOptions={screenOptions}>
                <Tabs.Screen
                    name="Home"
                    component={Home}
                    options={{
                        title: 'Home',
                        headerShown: false,
                        tabBarIcon: ({color, size}) => <AntDesign name={'home'} color={color} size={size} />,
                    }}
                />
                <Tabs.Screen
                    name="Data"
                    component={Summary}
                    options={{
                        title: 'Summary',
                        headerShown: false,
                        tabBarIcon: ({color, size}) => <Feather name={'server'} color={color} size={size} />,
                    }}
                />
            </Tabs.Navigator>
        </NavigationContainer>
    );
}
