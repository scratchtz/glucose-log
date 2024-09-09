import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import {
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
} from '@expo-google-fonts/poppins';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigation from '@/navigation/Navigation';
import {useFonts} from 'expo-font';
import {useCallback} from 'react';
import {UnistylesRegistry} from 'react-native-unistyles';
import {breakpoints} from '@/utils/styles/breakpoints';
import {darkTheme, lightTheme} from '@/utils/styles/theme';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useEncryptionStorage} from '@/hooks/useEncryptedStorage';

// Prevent the splash screen from auto-hiding before asset loading is complete.
void SplashScreen.preventAutoHideAsync().catch(e => console.warn(e));

UnistylesRegistry.addBreakpoints(breakpoints).addThemes({
    light: lightTheme,
    dark: darkTheme,
});

export default function App() {
    const [encryptedStorageLoaded] = useEncryptionStorage();
    const [fontsLoaded] = useFonts({
        'Font-100': Poppins_100Thin,
        'Font-200': Poppins_200ExtraLight,
        'Font-300': Poppins_300Light,
        'Font-400': Poppins_400Regular,
        'Font-500': Poppins_500Medium,
        'Font-600': Poppins_600SemiBold,
        'Font-700': Poppins_700Bold,
        'Font-800': Poppins_800ExtraBold,
        'Font-900': Poppins_900Black,
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) await SplashScreen.hideAsync();
    }, [fontsLoaded]);

    if (!fontsLoaded || !encryptedStorageLoaded) {
        return null;
    }
    return (
        <SafeAreaProvider onLayout={onLayoutRootView}>
            <GestureHandlerRootView>
                <BottomSheetModalProvider>
                    <Navigation />
                </BottomSheetModalProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}
