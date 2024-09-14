import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {forwardRef, useCallback, useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {useStyles} from 'react-native-unistyles';
import {X} from 'lucide-react-native';
import {commonStyles} from '@/screens/Settings/components/common-styles';
import {FullWindowOverlay} from 'react-native-screens';
import {getDefaultStore, useAtomValue} from 'jotai/index';
import {DefaultLanguage, languageAtom} from '@/storage/atoms/language';

type Props = {};

const LANGUAGE = [
    {language: 'en', label: 'English'},
    {language: 'sw', label: 'Swahili'},
    {language: 'kr', label: 'Korean'},
];

export const Language = forwardRef<BottomSheetModal, Props>((Props, ref: any) => {
    const snapPoints = useMemo(() => ['30', '50%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );
    const language = useAtomValue(languageAtom);
    const {styles, theme} = useStyles(commonStyles);
    const onClose = () => ref.current?.close();

    function onConfirm(lang: string) {
        getDefaultStore().set(languageAtom, lang as DefaultLanguage);
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
            snapPoints={snapPoints}>
            <View style={styles.header}>
                <Text variant="h3">Default Language</Text>
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
