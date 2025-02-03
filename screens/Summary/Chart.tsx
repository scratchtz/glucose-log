import {View} from 'react-native';
import {createStyleSheet, UnistylesRuntime, useStyles} from 'react-native-unistyles';
import {useCallback, useMemo} from 'react';
import {LineChart} from 'react-native-wagmi-charts';
import * as haptics from 'expo-haptics';
import {ILog} from '@/storage/db-service';
import {dataRangeAtom} from '@/storage/atoms/range';
import {dataUnitAtom, DefaultDataUnit} from '@/storage/atoms/unit';
import {useAtomValue} from 'jotai/index';

export const GRAPH_PERIOD = {
    DAY: '1',
    WEEK: '7',
    MONTH: '30',
    QUARTER: '90',
    YEAR: '365',
} as const;
export const GRAPH_PERIODS = Object.values(GRAPH_PERIOD);
export type GRAPH_PERIOD = (typeof GRAPH_PERIOD)[keyof typeof GRAPH_PERIOD];

type Props = {
    highest: DataPoint;
    lowest: DataPoint;
    data: ILog[];
    period: GRAPH_PERIOD;
    unit: DefaultDataUnit;
};

export type DataPoint = {
    value: number;
    timestamp: number;
    label: string;
    index: number;
};

export const defaultDataPoint: DataPoint = {value: 0, timestamp: 0, label: '', index: 0};
const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
};

export const Chart = ({data, highest, lowest}: Props) => {
    const invokeHaptic = useCallback(() => {
        haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    }, []);

    const unit = useAtomValue(dataUnitAtom);
    const {maxVal, minVal} = useAtomValue(dataRangeAtom);
    const {min, max} = useMemo(() => {
        return {min: Math.max(lowest.value - 50, 0), max: Math.min(highest.value + 20, 1000)};
    }, [unit, highest, lowest]);

    const {styles, theme} = useStyles(stylesheet);
    return (
        <View style={styles.container}>
            <LineChart.Provider data={data} yRange={{min, max}}>
                <LineChart height={300} width={UnistylesRuntime.screen.width}>
                    <LineChart.Path color={theme.colors.primary}>
                        <LineChart.HorizontalLine at={{value: maxVal}} color={theme.colors.text.tertiary} />
                        <LineChart.HorizontalLine at={{value: minVal}} color={theme.colors.text.tertiary} />
                        <LineChart.Gradient color={theme.colors.primary} />
                        <LineChart.Dot color={theme.colors.secondary} at={lowest.index} hasPulse />
                        <LineChart.Dot color={theme.colors.secondary} at={highest.index} hasPulse />
                    </LineChart.Path>
                    <LineChart.CursorCrosshair
                        color={theme.colors.primary}
                        onActivated={invokeHaptic}
                        onEnded={invokeHaptic}>
                        <LineChart.HoverTrap />
                        <LineChart.Tooltip position="top" style={styles.tooltipBox}>
                            <LineChart.DatetimeText
                                style={styles.dateText}
                                format={({value}) => {
                                    'worklet';
                                    return new Date(value).toLocaleDateString('en-US', dateOptions);
                                }}
                            />
                            <LineChart.PriceText
                                style={styles.glucoseText}
                                format={({value}) => {
                                    'worklet';
                                    return unit === 'mmol'
                                        ? `${(parseFloat(value) / 18).toFixed(1)} ${unit}`
                                        : `${parseFloat(value).toFixed(0)} ${unit}`;
                                }}
                            />
                        </LineChart.Tooltip>
                    </LineChart.CursorCrosshair>
                </LineChart>
            </LineChart.Provider>
        </View>
    );
};

const stylesheet = createStyleSheet(theme => ({
    container: {
        marginHorizontal: -theme.spacing.th,
    },
    tooltipBox: {
        backgroundColor: theme.card.background,
        paddingHorizontal: theme.spacing.l,
        paddingVertical: theme.spacing.m,
        borderRadius: theme.rounded.l,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    glucoseText: {
        fontFamily: 'Font-600',
        color: theme.colors.text.primary,
        fontSize: 12,
    },
    dateText: {
        fontFamily: 'Font-400',
        color: theme.colors.text.secondary,
        fontSize: 12,
    },
    highLowTooltip: {
        alignItems: 'center',
    },
}));
