import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {forwardRef, useCallback, useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {useStyles} from 'react-native-unistyles';
import {X} from 'lucide-react-native';
import {commonStyles} from '@/screens/Settings/components/commonStyles';
import {FullWindowOverlay} from 'react-native-screens';
import {useMMKVString} from 'react-native-mmkv';
import {StorageKeys} from '@/constants/storageKeys';
import {encryptedStorage} from '@/storage/mmkv';
import {useTranslation} from 'react-i18next';

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
    const {t} = useTranslation();

    function onConfirm(theme: string) {
        setTheme(theme);
        ref.current?.close();
    }

    const THEME = [
        {theme: 'dark', label: `${t('settings.dark')}`},
        {theme: 'light', label: `${t('settings.light')}`},
        {theme: 'system', label: `${t('settings.system')}`},
    ];

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
                <Text variant="h3">{t('settings.choose_theme')}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeWrap}>
                    <X size={styles.close.fontSize} color={styles.close.color} />
                </TouchableOpacity>
            </View>
            <BottomSheetScrollView contentContainerStyle={styles.scrollView}>
                {THEME.map(t => (
                    <TouchableOpacity
                        key={t.theme}
                        onPress={() => onConfirm(t.theme)}
                        style={[
                            styles.unit,
                            savedTheme === t.theme && {
                                backgroundColor: theme.colors.primary,
                            },
                            {marginBottom: 14},
                        ]}>
                        <Text variant={'h3'} style={savedTheme === t.theme && {color: 'white'}}>
                            {t.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});
