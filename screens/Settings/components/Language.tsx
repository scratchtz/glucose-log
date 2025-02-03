import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {forwardRef, useCallback, useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {useStyles} from 'react-native-unistyles';
import {X} from 'lucide-react-native';
import {commonStyles} from '@/screens/Settings/components/commonStyles';
import {useTranslation} from 'react-i18next';
import {useMMKVString} from 'react-native-mmkv';
import {StorageKeys} from '@/constants/storageKeys';
import {encryptedStorage} from '@/storage/mmkv';

type Props = {};

const LANGUAGES = ['en', 'sw', 'ko'];

export const Language = forwardRef<BottomSheetModal, Props>((Props, ref: any) => {
    const snapPoints = useMemo(() => [340, '50%', '80%'], []);
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

    return (
        <BottomSheetModal
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
                {LANGUAGES.map(l => (
                    <TouchableOpacity key={l} onPress={() => onConfirm(l)} style={styles.unit}>
                        <Text>{t(`constants.language.${l}`)}</Text>
                    </TouchableOpacity>
                ))}
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});
