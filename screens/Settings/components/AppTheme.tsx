import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {forwardRef, useCallback, useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {UnistylesRuntime, useStyles} from 'react-native-unistyles';
import {X} from 'lucide-react-native';
import {commonStyles} from '@/screens/Settings/components/common-styles';
import {FullWindowOverlay} from 'react-native-screens';
import {useMMKVString} from 'react-native-mmkv';
import {StorageKeys} from '@/constants/storageKeys';
import {encryptedStorage} from '@/storage/mmkv';

type Props = {};

export const AppTheme = forwardRef<BottomSheetModal, Props>((Props, ref: any) => {
    const snapPoints = useMemo(() => ['35', '50%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );
    const [savedTheme, setTheme] = useMMKVString(StorageKeys.KEY_APP_THEME, encryptedStorage);
    const {styles, theme} = useStyles(commonStyles);
    const onClose = () => ref.current?.close();

    function onConfirm(theme: string) {
        setTheme(theme);
        ref.current?.close();
    }

    const containerComponent = useCallback((props: any) => <FullWindowOverlay>{props.children}</FullWindowOverlay>, []);
    return (
        <BottomSheetModal
            containerComponent={containerComponent}
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
                    style={[styles.unit, savedTheme === 'dark' && {backgroundColor: theme.colors.primary}]}>
                    <Text variant={'h3'} style={savedTheme === 'dark' && {color: 'white'}}>
                        Dark
                    </Text>
                </TouchableOpacity>
                <View style={{marginTop: 14}}></View>
                <TouchableOpacity
                    onPress={() => onConfirm('light')}
                    style={[styles.unit, savedTheme === 'light' && {backgroundColor: theme.colors.primary}]}>
                    <Text variant={'h3'} style={savedTheme === 'light' && {color: 'white'}}>
                        Light
                    </Text>
                </TouchableOpacity>
                <View style={{marginTop: 14}}></View>
                <TouchableOpacity
                    onPress={() => onConfirm('system')}
                    style={[styles.unit, savedTheme === 'system' && {backgroundColor: theme.colors.primary}]}>
                    <Text variant={'h3'} style={savedTheme === 'system' && {color: 'white'}}>
                        System
                    </Text>
                </TouchableOpacity>
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});
