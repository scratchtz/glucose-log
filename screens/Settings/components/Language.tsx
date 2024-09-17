import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {forwardRef, useCallback, useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {useStyles} from 'react-native-unistyles';
import {X} from 'lucide-react-native';
import {commonStyles} from '@/screens/Settings/components/common-styles';
import {FullWindowOverlay} from 'react-native-screens';
import {useTranslation} from 'react-i18next';
import {useMMKVString} from 'react-native-mmkv';
import {StorageKeys} from '@/constants/storageKeys';
import {encryptedStorage} from '@/storage/mmkv';

type Props = {};

export const Language = forwardRef<BottomSheetModal, Props>((Props, ref: any) => {
    const snapPoints = useMemo(() => ['30', '50%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );
    const {styles, theme} = useStyles(commonStyles);
    const onClose = () => ref.current?.close();
    const {t} = useTranslation();
    const [language, setLanguage] = useMMKVString(StorageKeys.KEY_LANGUAGE, encryptedStorage);

    function onConfirm(lang: string) {
        setLanguage(lang);
        ref.current?.close();
    }

    const LANGUAGE = [
        {language: 'en', label: `${t('settings.en')}`},
        {language: 'sw', label: `${t('settings.sw')}`},
        {language: 'kr', label: `${t('settings.kr')}`},
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
            snapPoints={snapPoints}>
            <View style={styles.header}>
                <Text variant="h3">{t('settings.language')}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeWrap}>
                    <X size={styles.close.fontSize} color={styles.close.color} />
                </TouchableOpacity>
            </View>
            <BottomSheetScrollView contentContainerStyle={styles.scrollView}>
                {LANGUAGE.map(l => (
                    <TouchableOpacity
                        key={l.language}
                        onPress={() => onConfirm(l.language)}
                        style={[
                            styles.unit,
                            language === l.language && {
                                backgroundColor: theme.colors.primary,
                            },
                            {marginBottom: 14},
                        ]}>
                        <Text variant={'h3'} style={language === l.language && {color: 'white'}}>
                            {l.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});
