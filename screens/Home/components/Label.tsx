import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {forwardRef, useCallback, useMemo, useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {AntDesign} from '@expo/vector-icons';
import DateTimePicker from 'react-native-modal-datetime-picker';

interface Props {
    UpdateLabel: (label: string) => void;
    onConfirmSave: () => void;
    handleDate: (date: Date) => void;
}

export const Label = forwardRef((props: Props, ref: any) => {
    const snapPoints = useMemo(() => ['60%', '85%'], []);
    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} opacity={0.5} disappearsOnIndex={-1} appearsOnIndex={0} />,
        [],
    );

    const [isDateVisible, setIsDateVisible] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);

    const {styles, theme} = useStyles(stylesheet);
    const onClose = () => ref.current?.close();

    const onConfirmDate = (date: Date) => {
        props.handleDate(date);
        setDate(date);
        setIsDateVisible(false);
    };

    const onCancel = () => {
        setIsDateVisible(false);
    };

    return (
        <BottomSheetModal
            enablePanDownToClose
            backgroundStyle={styles.container}
            handleIndicatorStyle={styles.indicator}
            ref={ref}
            backdropComponent={renderBackdrop}
            snapPoints={snapPoints}>
            <BottomSheetScrollView contentContainerStyle={styles.scrollView}>
                <TouchableOpacity onPress={onClose} style={styles.close}>
                    <AntDesign name={'closecircleo'} size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <View>
                    <Text variant={'h3'}>Label</Text>
                    <TextInput
                        placeholder={'Label'}
                        onChangeText={text => props.UpdateLabel(text)}
                        style={styles.input}
                        clearButtonMode={'always'}
                        returnKeyType={'done'}
                    />
                </View>
                <View>
                    <TouchableOpacity style={styles.button} onPress={() => setIsDateVisible(true)}>
                        {date ? (
                            <View style={styles.dateRender}>
                                <Text variant={'h3'}>Picked Date:</Text>
                                <Text variant={'h2'}>{date.toLocaleDateString()}</Text>
                            </View>
                        ) : (
                            <Text>Pick Date</Text>
                        )}
                    </TouchableOpacity>
                    <DateTimePicker
                        maximumDate={new Date()}
                        display={'inline'}
                        isVisible={isDateVisible}
                        onConfirm={onConfirmDate}
                        onCancel={onCancel}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={props.onConfirmSave}>
                    <Text>Confirm</Text>
                </TouchableOpacity>
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});

const stylesheet = createStyleSheet(theme => ({
    container: {
        backgroundColor: theme.colors.background,
    },
    scrollView: {
        marginHorizontal: theme.spacing.th,
        marginTop: theme.spacing.l,
        gap: theme.spacing.m,
    },
    indicator: {
        backgroundColor: theme.colors.text.tertiary,
    },
    close: {
        alignItems: 'flex-end',
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.rounded.l,
        padding: theme.spacing.l,
        marginTop: theme.spacing.s,
        color: theme.colors.text.primary,
    },
    button: {
        borderWidth: 1,
        borderColor: theme.card.border,
        borderRadius: theme.rounded.l,
        backgroundColor: theme.card.background,
        padding: theme.spacing.l,
        alignItems: 'center',
    },
    dateRender: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
}));
