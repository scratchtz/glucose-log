import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {createStyleSheet, UnistylesRuntime, useStyles} from 'react-native-unistyles';
import {useCallback, useRef} from 'react';
import {addData} from '@/storage/db-service';
import {ChartColumn, Save} from 'lucide-react-native';
import {Keyboard} from './Keyboard';
import {useGlucoseInput} from '@/screens/Home/constants';
import {UnitDisplay} from '@/screens/Home/components/UnitDisplay';
import {Text} from '@/components/Text/Text';
import {palette} from '@/utils/styles/palette';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {Label} from '@/screens/Home/components/Label';
import {useState} from 'react';

export function Home({navigation}: any) {
    const {styles} = useStyles(stylesheet);
    const {values, currentUnit, setCurrentUnit, onNumberPress, onBackspace} = useGlucoseInput('mmol');
    const model = useRef<BottomSheetModal>(null);

    const [label, setLabel] = useState('');
    const [date, setDate] = useState(new Date());

    const updateLabel = (label: string) => {
        setLabel(label);
    };

    const handleDate = (date: Date) => {
        setDate(date);
    };

    const onSave = () => {
        model.current?.present();
    };

    const onConfirmSave = useCallback(() => {
        model.current?.close();
        addData({
            levels: parseFloat(values.mmol),
            measurement: 'mmol/L',
            day: date.getDay(),
            label: label,
        });
    }, [values.mmol, label]);

    return (
        <View style={styles.container}>
            <View style={styles.iconsWrapper}>
                <TouchableOpacity
                    onPress={onSave}
                    style={styles.actionWrapper}
                    accessibilityLabel={'Save glucose measurement'}>
                    <View style={styles.actionIconWrapper}>
                        <Save color={styles.actionIcon.color} size={styles.actionIcon.fontSize} />
                    </View>
                    <Text style={styles.actionText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Summary')}
                    style={styles.actionWrapper}
                    accessibilityLabel="View summary chart">
                    <View style={styles.actionIconWrapper}>
                        <ChartColumn color={styles.actionIcon.color} size={styles.actionIcon.fontSize} />
                    </View>
                    <Text style={styles.actionText}>Chart</Text>
                </TouchableOpacity>
            </View>
            <UnitDisplay
                unit="mmol"
                value={values.mmol}
                isSelected={currentUnit === 'mmol'}
                onPress={() => setCurrentUnit('mmol')}
            />
            <UnitDisplay
                unit="mg"
                value={values.mg}
                isSelected={currentUnit === 'mg'}
                onPress={() => setCurrentUnit('mg')}
            />
            <Keyboard onBackspace={onBackspace} onNumberPress={onNumberPress} />
            <Label ref={model} UpdateLabel={updateLabel} onConfirmSave={onConfirmSave} handleDate={handleDate} />
        </View>
    );
}

const stylesheet = createStyleSheet(theme => ({
    container: {
        paddingTop: UnistylesRuntime.insets.top,
        marginHorizontal: theme.spacing.th,
        flex: 1,
    },
    iconsWrapper: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.m,
        gap: theme.spacing.s,
    },
    actionWrapper: {
        borderRadius: theme.rounded.full,
        padding: theme.spacing.s,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.border,
    },
    actionIconWrapper: {
        backgroundColor: palette.neutral800,
        borderRadius: theme.rounded.full,
        justifyContent: 'center',
        alignItems: 'center',
        width: 28,
        height: 28,
    },
    actionIcon: {
        color: palette.white,
        fontSize: 18,
    },
    actionText: {
        color: theme.colors.text.primary,
    },
}));
