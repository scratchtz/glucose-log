import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {forwardRef, useCallback, useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {X} from 'lucide-react-native';
import {dataRangeAtom} from '@/storage/atoms/range';
import {FullWindowOverlay} from 'react-native-screens';
import {getDefaultStore, useAtomValue} from 'jotai/index';
import {useAtom} from 'jotai';
import {dataUnitAtom} from '@/storage/atoms/unit';
import {useTranslation} from 'react-i18next';

type Props = {};

export const DataRange = forwardRef<BottomSheetModal, Props>((Props, ref: any) => {
    const snapPoints = useMemo(() => ['40', '65%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );
    const {t} = useTranslation();

    const [currentUnit] = useAtom(dataUnitAtom);
    const {maxVal, minVal} = useAtomValue(dataRangeAtom);

    const [minRange, setMinRange] = useState('');
    const [maxRange, setMaxRange] = useState('');

    const {styles, theme} = useStyles(stylesheet);
    const onClose = () => ref.current?.close();

    function onChangeMinRange(val: string) {
        //set min range here
    }

    function onConfirm() {
        if ((!maxRange || !minRange) && (!maxVal || !minVal)) {
            return;
        }
        const max = parseFloat(maxRange);
        const min = parseFloat(minRange);
        if (min >= max) {
            return;
        }
        getDefaultStore().set(dataRangeAtom, {minVal: min || minVal, maxVal: max || maxVal});
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
                <Text variant="h3">
                    {t('settings.default_range')} {''}
                    {t(`constants.unit.${currentUnit}`)}
                </Text>
                <TouchableOpacity onPress={onClose} style={styles.closeWrap}>
                    <X size={styles.close.fontSize} color={styles.close.color} />
                </TouchableOpacity>
            </View>
            <BottomSheetScrollView contentContainerStyle={styles.scrollView}>
                <Text color={'tertiary'}>{t('settings.pick_min_range')}</Text>
                <BottomSheetTextInput
                    style={styles.input}
                    clearButtonMode={'always'}
                    placeholder={'Min Range'}
                    defaultValue={currentUnit === 'mmol' ? (minVal / 18).toFixed(2) : minVal.toString()}
                    onChangeText={setMinRange}
                    placeholderTextColor={theme.colors.text.tertiary}
                    keyboardType={'numeric'}
                />
                <View style={{marginTop: theme.spacing.m}}></View>
                <Text color={'tertiary'}>{t('settings.pick_max_range')}</Text>
                <BottomSheetTextInput
                    style={styles.input}
                    clearButtonMode={'always'}
                    placeholder={'Max Range'}
                    defaultValue={currentUnit === 'mmol' ? (maxVal / 18).toFixed(2) : maxVal.toString()}
                    onChangeText={setMaxRange}
                    placeholderTextColor={theme.colors.text.tertiary}
                    keyboardType={'numeric'}
                />
                <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                    <Text style={styles.confirmText} weight="500">
                        {t('settings.confirm')}
                    </Text>
                </TouchableOpacity>
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});

const stylesheet = createStyleSheet(theme => ({
    container: {
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        marginHorizontal: theme.spacing.th,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    closeWrap: {
        borderRadius: theme.rounded.full,
        backgroundColor: theme.colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        width: 24,
        height: 24,
    },
    close: {
        fontSize: 18,
        color: theme.colors.text.primary,
    },
    scrollView: {
        marginHorizontal: theme.spacing.th,
        marginTop: theme.spacing.l,
    },
    indicator: {
        backgroundColor: theme.colors.text.tertiary,
    },
    input: {
        backgroundColor: theme.card.background,
        marginTop: theme.spacing.s,
        borderRadius: theme.spacing.m,
        padding: theme.spacing.m,
        color: theme.colors.text.primary,
    },
    confirmButton: {
        borderColor: theme.card.border,
        borderRadius: theme.rounded.m,
        padding: theme.spacing.m,
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        marginTop: theme.spacing.l,
    },
    confirmText: {
        color: 'white',
    },
}));
