import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {forwardRef, useCallback, useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {useStyles} from 'react-native-unistyles';
import {X} from 'lucide-react-native';
import {dataUnitAtom, DefaultDataUnit} from '@/storage/atoms/unit';
import {commonStyles} from '@/screens/Settings/components/common-styles';
import {FullWindowOverlay} from 'react-native-screens';
import {getDefaultStore, useAtomValue} from 'jotai/index';
import {useTranslation} from 'react-i18next';

type Props = {};

export const DataUnit = forwardRef<BottomSheetModal, Props>((Props, ref: any) => {
    const snapPoints = useMemo(() => ['30', '50%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );
    const unit = useAtomValue(dataUnitAtom);
    const {styles, theme} = useStyles(commonStyles);
    const onClose = () => ref.current?.close();
    const {t} = useTranslation();

    function onConfirm(unit: DefaultDataUnit) {
        getDefaultStore().set(dataUnitAtom, unit);
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
                <Text variant="h3">{t('settings.default_unit')}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeWrap}>
                    <X size={styles.close.fontSize} color={styles.close.color} />
                </TouchableOpacity>
            </View>
            <BottomSheetScrollView contentContainerStyle={styles.scrollView}>
                <TouchableOpacity
                    onPress={() => onConfirm('mmol')}
                    style={[styles.unit, unit === 'mmol' && {backgroundColor: theme.colors.primary}]}>
                    <Text variant={'h3'} style={unit === 'mmol' && {color: 'white'}}>
                        mmol/L
                    </Text>
                </TouchableOpacity>
                <View style={{marginTop: 14}}></View>
                <TouchableOpacity
                    onPress={() => onConfirm('mg')}
                    style={[styles.unit, unit === 'mg' && {backgroundColor: theme.colors.primary}]}>
                    <Text variant={'h3'} style={unit === 'mg' && {color: 'white'}}>
                        mg/dl
                    </Text>
                </TouchableOpacity>
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});
