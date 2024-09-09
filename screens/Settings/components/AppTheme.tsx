import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {forwardRef, useCallback, useMemo} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {UnistylesRuntime, useStyles} from 'react-native-unistyles';
import {X} from 'lucide-react-native';
import {commonStyles} from '@/screens/Settings/components/common-styles';
import {DefaultTheme, setDefaultTheme, useDefaultTheme} from '@/storage/atoms/theme';

type Props = {};

export const AppTheme = forwardRef<BottomSheetModal, Props>((Props, ref: any) => {
    const snapPoints = useMemo(() => ['35', '50%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );
    const {styles, theme} = useStyles(commonStyles);
    const onClose = () => ref.current?.close();

    const appTheme = useDefaultTheme();

    function onConfirm(theme: DefaultTheme) {
        UnistylesRuntime.setTheme(theme);
        setDefaultTheme(theme);
        ref.current?.close();
    }

    return (
        <BottomSheetModal
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
                    <Text variant={'h3'}>Dark</Text>
                </TouchableOpacity>
                <View style={{marginTop: 14}}></View>
                <TouchableOpacity
                    onPress={() => onConfirm('light')}
                    style={[styles.unit, appTheme === 'light' && {backgroundColor: theme.colors.primary}]}>
                    <Text variant={'h3'}>Light</Text>
                </TouchableOpacity>
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});
