import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {forwardRef, useCallback, useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {useStyles} from 'react-native-unistyles';
import {X} from 'lucide-react-native';
import {DefaultDataUnit, setDataUnit, useDataUnit} from '@/storage/atoms/unit';
import {commonStyles} from '@/screens/Settings/components/common-styles';

type Props = {};

export const DataUnit = forwardRef<BottomSheetModal, Props>((Props, ref: any) => {
    const snapPoints = useMemo(() => ['30', '50%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );
    const unit = useDataUnit();
    const {styles, theme} = useStyles(commonStyles);
    const onClose = () => ref.current?.close();

    function onConfirm(unit: DefaultDataUnit) {
        setDataUnit(unit);
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
                <Text variant="h3">Default Unit</Text>
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
