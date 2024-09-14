import {TouchableOpacity, View} from 'react-native';
import {createStyleSheet, UnistylesRuntime, useStyles} from 'react-native-unistyles';
import {useCallback, useEffect, useRef} from 'react';
import {ChartColumn, Save, Settings} from 'lucide-react-native';
import {Keyboard} from './Keyboard';
import {useGlucoseInput} from '@/screens/Home/constants';
import {UnitDisplay} from '@/screens/Home/components/UnitDisplay';
import {Text} from '@/components/Text/Text';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {SaveModal} from '@/screens/Home/components/SaveModal';
import {dataUnitAtom} from '@/storage/atoms/unit';
import {useAtomValue} from 'jotai/index';
import {useTranslation} from 'react-i18next';

export function Home({navigation}: any) {
    const {theme, styles} = useStyles(stylesheet);
    const initialUnit = useAtomValue(dataUnitAtom);
    const {values, currentUnit, setCurrentUnit, onNumberPress, onBackspace} = useGlucoseInput(initialUnit);
    const model = useRef<BottomSheetModal>(null);
    const {t} = useTranslation();

    useEffect(() => {
        setCurrentUnit(initialUnit);
    }, [initialUnit]);

    const onSave = useCallback(() => {
        if (values.mg === '0' || values.mg === '') return;
        model.current?.present();
    }, [values]);

    return (
        <View style={styles.container}>
            <View style={styles.iconsWrapper}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Settings');
                    }}
                    style={styles.actionWrapper}>
                    <Settings color={theme.colors.text.primary} size={styles.actionIcon.fontSize} />
                </TouchableOpacity>
                <View style={{flex: 1}} />
                <TouchableOpacity
                    onPress={onSave}
                    style={styles.actionWrapper}
                    accessibilityLabel={'Save glucose measurement'}>
                    <View style={styles.actionIconWrapper}>
                        <Save color={styles.actionIcon.color} size={styles.actionIcon.fontSize} />
                    </View>
                    <Text style={styles.actionText}>{t('Save')}</Text>
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
        borderColor: theme.colors.border,
        padding: theme.spacing.s,
        gap: theme.spacing.s,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
    },
    actionIconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionIcon: {
        color: theme.colors.text.primary,
        fontSize: 20,
    },
    actionText: {
        color: theme.colors.text.primary,
        fontFamily: 'Font-500',
    },
}));
