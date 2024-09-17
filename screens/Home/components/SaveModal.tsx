import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {forwardRef, useCallback, useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import DateTimePicker from 'react-native-modal-datetime-picker';
import DB from '@/storage/db-service';
import {X} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

type Props = {
    mgValue: string;
};

export const SaveModal = forwardRef(({mgValue}: Props, ref: any) => {
    const snapPoints = useMemo(() => ['45', '75%', '94%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );

    const navigation = useNavigation();

    const [isDateVisible, setIsDateVisible] = useState(false);
    const [date, setDate] = useState<Date | null>(new Date());
    const [label, setLabel] = useState('');
    const {t} = useTranslation();

    const {styles, theme} = useStyles(stylesheet);
    const onClose = () => ref.current?.close();
    const onSave = () => {
        const db = DB.getInstance();
        try {
            let timestamp = new Date().getTime();
            if (date) timestamp = date.getTime();
            db.record({
                value: parseFloat(mgValue),
                timestamp: timestamp,
                label: label,
            });
            onClose();
            navigation.navigate('Summary');
        } catch (error) {
            console.log(error);
        }
    };

    const onConfirmDate = (date: Date) => {
        setDate(date);
        setIsDateVisible(false);
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
            <View style={styles.header}>
                <Text variant="h3">{t('home.save_data')}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeWrap}>
                    <X size={styles.close.fontSize} color={styles.close.color} />
                </TouchableOpacity>
            </View>
            <BottomSheetScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.label}>{t('home.label_sample')}</Text>
                <View style={styles.inputWrap}>
                    <BottomSheetTextInput
                        placeholder={t('home.label')}
                        onChangeText={setLabel}
                        style={styles.input}
                        clearButtonMode={'always'}
                        returnKeyType={'done'}
                    />
                </View>

                <Text style={styles.label}>{t('home.timestamp')}</Text>
                <TouchableOpacity style={styles.timestampButton} onPress={() => setIsDateVisible(true)}>
                    {date ? (
                        <View style={styles.dateRender}>
                            <Text>{date.toLocaleString()}</Text>
                        </View>
                    ) : (
                        <Text>Pick Time</Text>
                    )}
                </TouchableOpacity>
                <DateTimePicker
                    mode={'datetime'}
                    maximumDate={new Date()}
                    isVisible={isDateVisible}
                    onConfirm={onConfirmDate}
                    onCancel={() => setIsDateVisible(false)}
                />
                <TouchableOpacity style={styles.confirmButton} onPress={onSave}>
                    <Text style={styles.confirmText} weight="500">
                        {t('home.record')}
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
    inputWrap: {
        backgroundColor: theme.card.background,
        borderColor: theme.colors.border,
        borderRadius: theme.rounded.m,
        marginTop: theme.spacing.s,
        borderWidth: 1,
    },
    input: {
        ...theme.text.body,
        padding: theme.spacing.l,
    },
    timestampButton: {
        borderWidth: 1,
        borderColor: theme.card.border,
        borderRadius: theme.rounded.m,
        backgroundColor: theme.card.background,
        padding: theme.spacing.l,
        alignItems: 'center',
    },
    dateRender: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    confirmButton: {
        borderWidth: 1,
        borderColor: theme.card.border,
        borderRadius: theme.rounded.m,
        padding: theme.spacing.l,
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        marginTop: theme.spacing.l,
    },
    confirmText: {
        color: 'white',
    },
    label: {
        marginTop: theme.spacing.m,
        marginLeft: theme.spacing.xs,
    },
}));
