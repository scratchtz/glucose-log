import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {forwardRef, useCallback, useMemo, useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {X} from 'lucide-react-native';
import {setDataRange} from '@/storage/atoms/range';

type Props = {};

export const DataRange = forwardRef<BottomSheetModal, Props>((Props, ref: any) => {
    const snapPoints = useMemo(() => ['40', '65%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );
    const [minRange, setMinRange] = useState('');
    const [maxRange, setMaxRange] = useState('');

    const {styles, theme} = useStyles(stylesheet);
    const onClose = () => ref.current?.close();

    function onConfirm() {
        if (!maxRange || !minRange) {
            return;
        }

        const max = parseFloat(maxRange);
        const min = parseFloat(minRange);

        if (min >= max) {
            return;
        }

        setDataRange({minVal: min, maxVal: max});
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
                <Text variant="h3">Default Range</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeWrap}>
                    <X size={styles.close.fontSize} color={styles.close.color} />
                </TouchableOpacity>
            </View>
            <BottomSheetScrollView contentContainerStyle={styles.scrollView}>
                <Text color={'tertiary'}>Pick Min Range</Text>
                <BottomSheetTextInput
                    style={styles.input}
                    clearButtonMode={'always'}
                    placeholder={'Min Range'}
                    onChangeText={setMinRange}
                    placeholderTextColor={theme.colors.text.tertiary}
                    keyboardType={'numeric'}
                />
                <View style={{marginTop: theme.spacing.m}}></View>
                <Text color={'tertiary'}>Pick Max Range</Text>
                <BottomSheetTextInput
                    style={styles.input}
                    clearButtonMode={'always'}
                    placeholder={'Min Range'}
                    onChangeText={setMaxRange}
                    placeholderTextColor={theme.colors.text.tertiary}
                    keyboardType={'numeric'}
                />
                <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                    <Text style={styles.confirmText} weight="500">
                        Confirm
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
        borderWidth: 1,
        marginTop: theme.spacing.s,
        borderRadius: theme.spacing.l,
        padding: theme.spacing.m,
        color: theme.colors.text.primary,
    },
    confirmButton: {
        borderWidth: 1,
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
