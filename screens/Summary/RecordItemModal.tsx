import {BottomSheetBackdrop, BottomSheetModal} from '@gorhom/bottom-sheet';
import {forwardRef, useCallback, useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {X} from 'lucide-react-native';
import DB, {ILog} from '@/storage/db-service';
import {atom, useAtomValue} from 'jotai/index';
import {dataUnitAtom} from '@/storage/atoms/unit';
import {palette} from '@/utils/styles/palette';
import {useTranslation} from 'react-i18next';
import {useSetAtom} from 'jotai';

//to track the number of times the delete button is pressed
//forces re-render on summary data
export const deleteCounterAtom = atom(0);

export const RecordItemModal = forwardRef<BottomSheetModal, ILog>((props, ref: any) => {
    const snapPoints = useMemo(() => [300, '50%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );
    const {t} = useTranslation();
    const {styles} = useStyles(stylesheet);
    const onClose = () => ref.current?.close();
    const {label, value, timestamp} = props;
    const unit = useAtomValue(dataUnitAtom);
    const setCounter = useSetAtom(deleteCounterAtom);

    const showValue = unit === 'mmol' ? (value / 18).toFixed(1) : value.toString();

    const onDelete = () => {
        if (!props.id) return;
        const db = DB.getInstance();
        db.delete(props.id);
        onClose();
        setCounter(prev => prev + 1);
    };

    return (
        <BottomSheetModal
            enablePanDownToClose
            backgroundStyle={styles.container}
            handleIndicatorStyle={styles.indicator}
            ref={ref}
            backdropComponent={renderBackdrop}
            keyboardBehavior="extend"
            snapPoints={snapPoints}>
            <View style={styles.wrapper}>
                <View style={styles.header}>
                    <View style={{flex: 1}} />
                    <TouchableOpacity onPress={onClose} style={styles.closeWrap}>
                        <X size={styles.close.fontSize} color={styles.close.color} />
                    </TouchableOpacity>
                </View>
                {label && <Text variant={'h3'}>{label}</Text>}
                <Text variant={'h1'}>
                    {showValue} {t(`constants.unit.${unit}`)}
                </Text>
                <Text>{new Date(timestamp).toLocaleString()}</Text>

                <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                    <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </BottomSheetModal>
    );
});

const stylesheet = createStyleSheet(theme => ({
    container: {
        backgroundColor: theme.colors.background,
    },
    wrapper: {
        marginHorizontal: theme.spacing.th,
    },
    indicator: {
        backgroundColor: theme.colors.text.tertiary,
    },
    header: {
        flexDirection: 'row',
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
    deleteButton: {
        backgroundColor: palette.rose500,
        padding: theme.spacing.m,
        borderRadius: theme.rounded.l,
        marginTop: theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
    },
    deleteText: {
        color: 'white',
    },
}));
