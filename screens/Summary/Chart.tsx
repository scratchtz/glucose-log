import {ScrollView, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, UnistylesRuntime, useStyles} from 'react-native-unistyles';
import {useCallback, useMemo, useState} from 'react';
import DB, {ILog} from '@/storage/db-service';
import {LineChart} from 'react-native-wagmi-charts';
import * as haptics from 'expo-haptics';
import {Unit} from '../Home/constants';

export const GRAPH_PERIOD = {
    DAY: '1',
    WEEK: '7',
    MONTH: '30',
    QUARTER: '90',
    YEAR: '365',
} as const;
export const GRAPH_PERIODS = Object.values(GRAPH_PERIOD);
export type GRAPH_PERIOD = (typeof GRAPH_PERIOD)[keyof typeof GRAPH_PERIOD];

export const GRAPH_PERIOD_LABELS: Record<GRAPH_PERIOD, string> = {
    '1': '24H',
    '7': '7D',
    '30': '1M',
    '90': '3M',
    '365': '1Y',
};

type Props = {
    period: GRAPH_PERIOD;
    unit: Unit;
};

const data = [
    {
        timestamp: 1625945400000,
        value: 100,
    },
    {
        timestamp: 1625946300000,
        value: 340,
    },
    {
        timestamp: 1625947200000,
        value: 120,
    },
    {
        timestamp: 1625948100000,
        value: 234,
    },
    {
        timestamp: 1625949000000,
        value: 80,
    },
    {
        timestamp: 1625950000000,
        value: 0,
    },
    {
        timestamp: 1625950900000,
        value: 120,
    },
];

export const Chart = ({}: Props) => {
    const DATA = Array.from({length: 31}, (_, i) => ({
        day: i,
        lowTmp: 20 + 10 * Math.random(),
        highTmp: 40 + 30 * Math.random(),
    }));

    const invokeHaptic = useCallback(() => {
        haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    }, []);

    const {styles, theme} = useStyles(stylesheet);
    return (
        <View style={styles.container}>
            <LineChart.Provider data={data} yRange={{min: 0, max: 400}}>
                <LineChart height={380} width={UnistylesRuntime.screen.width}>
                    <LineChart.Path color={theme.colors.text.primary}>
                        <LineChart.HorizontalLine at={{value: 80}} color="green" />
                        <LineChart.HorizontalLine at={{value: 180}} color="green" />
                    </LineChart.Path>
                    <LineChart.CursorCrosshair
                        color={theme.colors.text.tertiary}
                        onActivated={invokeHaptic}
                        onEnded={invokeHaptic}>
                        <LineChart.HoverTrap />
                        <LineChart.Tooltip
                            position="bottom"
                            textStyle={{
                                color: 'white',
                                fontSize: 14,
                                padding: 4,
                            }}>
                            <LineChart.PriceText
                                format={({value}) => {
                                    'worklet';
                                    // const formattedValue = yourOwnFormatValueFn(value);
                                    return `$${value} AUD`;
                                }}
                            />
                            <LineChart.DatetimeText
                                format={({value}) => {
                                    'worklet';
                                    const formattedDate = new Date(value).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                    });
                                    return formattedDate;
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
}));
