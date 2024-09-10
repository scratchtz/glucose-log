import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {forwardRef, useCallback, useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {UnistylesRuntime, useStyles} from 'react-native-unistyles';
import {X} from 'lucide-react-native';
import {commonStyles} from '@/screens/Settings/components/common-styles';
import {getDefaultTheme, setDefaultTheme, Theme} from '@/storage/theme';
import {FullWindowOverlay} from 'react-native-screens';

type Props = {};

export const AppTheme = forwardRef<BottomSheetModal, Props>((Props, ref: any) => {
    const snapPoints = useMemo(() => ['35', '50%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );
    const {styles, theme} = useStyles(commonStyles);
    const onClose = () => ref.current?.close();

    const appTheme = getDefaultTheme();

    function onConfirm(theme: Theme) {
        if (theme === 'system') {
            UnistylesRuntime.setAdaptiveThemes(true);
        } else {
            UnistylesRuntime.setAdaptiveThemes(false);
            UnistylesRuntime.setTheme(theme);
        }
        setDefaultTheme(theme);
        ref.current?.close();
    }

    return (
        <BottomSheetModal
            containerComponent={props => <FullWindowOverlay>{props.children}</FullWindowOverlay>}
            enablePanDownToClose
            backgroundStyle={styles.container}
            handleIndicatorStyle={styles.indicator}
            ref={ref}
            backdropComponent={renderBackdrop}
            keyboardBehavior="extend"
            snapPoints={snapPoints}>
            <View style={styles.header}>
                <Text variant="h3">Choose Theme</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeWrap}>
                    <X size={styles.close.fontSize} color={styles.close.color} />
                </TouchableOpacity>
            </View>
            <BottomSheetScrollView contentContainerStyle={styles.scrollView}>
                <TouchableOpacity
                    onPress={() => onConfirm('dark')}
                    style={[styles.unit, appTheme === 'dark' && {backgroundColor: theme.colors.primary}]}>
                    <Text variant={'h3'} style={appTheme === 'dark' && {color: 'white'}}>
                        Dark
                    </Text>
                </TouchableOpacity>
                <View style={{marginTop: 14}}></View>
                <TouchableOpacity
                    onPress={() => onConfirm('light')}
                    style={[styles.unit, appTheme === 'light' && {backgroundColor: theme.colors.primary}]}>
                    <Text variant={'h3'} style={appTheme === 'light' && {color: 'white'}}>
                        Light
                    </Text>
                </TouchableOpacity>
                <View style={{marginTop: 14}}></View>
                <TouchableOpacity
                    onPress={() => onConfirm('system')}
                    style={[styles.unit, appTheme === 'system' && {backgroundColor: theme.colors.primary}]}>
                    <Text variant={'h3'} style={appTheme === 'system' && {color: 'white'}}>
                        System
                    </Text>
                </TouchableOpacity>
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});
