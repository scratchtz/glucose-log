import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {createStyleSheet, UnistylesRuntime, useStyles} from 'react-native-unistyles';
import {useCallback, useRef} from 'react';
import {ChartColumn, Save} from 'lucide-react-native';
import {Keyboard} from './Keyboard';
import {useGlucoseInput} from '@/screens/Home/constants';
import {UnitDisplay} from '@/screens/Home/components/UnitDisplay';
import {Text} from '@/components/Text/Text';
import {palette} from '@/utils/styles/palette';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {SaveModal} from '@/screens/Home/components/SaveModal';

export function Home({navigation}: any) {
    const {styles} = useStyles(stylesheet);
    const {values, currentUnit, setCurrentUnit, onNumberPress, onBackspace} = useGlucoseInput('mg');
    const model = useRef<BottomSheetModal>(null);

    const onSave = useCallback(() => {
        if (values.mg === '0' || values.mg === '') return;
        model.current?.present();
    }, [values]);

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
                    <Text style={styles.actionText}>Summary</Text>
                </TouchableOpacity>
            </View>
            <UnitDisplay
                unit="mg"
                value={values.mg}
                isSelected={currentUnit === 'mg'}
                onPress={() => setCurrentUnit('mg')}
            />
            <UnitDisplay
                unit="mmol"
                value={values.mmol}
                isSelected={currentUnit === 'mmol'}
                onPress={() => setCurrentUnit('mmol')}
            />
            <Keyboard onBackspace={onBackspace} onNumberPress={onNumberPress} />
            <SaveModal mgValue={values.mg} ref={model} />
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
