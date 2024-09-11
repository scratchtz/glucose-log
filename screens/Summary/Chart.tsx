import {View} from 'react-native';
import {createStyleSheet, UnistylesRuntime, useStyles} from 'react-native-unistyles';
import {useCallback} from 'react';
import {LineChart} from 'react-native-wagmi-charts';
import * as haptics from 'expo-haptics';
import {ILog} from '@/storage/db-service';
import {dataRangeAtom} from '@/storage/atoms/range';
import {DefaultDataUnit} from '@/storage/atoms/unit';
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

export const GRAPH_PERIOD_LABELS: Record<GRAPH_PERIOD, string> = {
    '1': '24H',
    '7': '7D',
    '30': '1M',
    '90': '3M',
    '365': '1Y',
};

type Props = {
    data: ILog[];
    period: GRAPH_PERIOD;
    unit: DefaultDataUnit;
};

export const Chart = ({data}: Props) => {
    const invokeHaptic = useCallback(() => {
        haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    }, []);

    const {maxVal, minVal} = useAtomValue(dataRangeAtom);

    const {styles, theme} = useStyles(stylesheet);
    return (
        <View style={styles.container}>
            <LineChart.Provider data={data} yRange={{min: 0, max: 500}}>
                <LineChart height={380} width={UnistylesRuntime.screen.width}>
                    <LineChart.Path color={theme.colors.text.primary}>
                        <LineChart.HorizontalLine at={{value: maxVal}} color="green" />
                        <LineChart.HorizontalLine at={{value: minVal}} color="red" />
                    </LineChart.Path>
                    <LineChart.CursorCrosshair
                        color={theme.colors.primary}
                        onActivated={invokeHaptic}
                        onEnded={invokeHaptic}>
                        <LineChart.HoverTrap />
                        <LineChart.Tooltip
                            position="top"
                            textStyle={{
                                color: theme.colors.text.primary,
                                fontSize: 14,
                                padding: 4,
                            }}></LineChart.Tooltip>
                        <LineChart.Tooltip position={'bottom'}>
                            <LineChart.DatetimeText style={{color: theme.colors.text.primary}} />
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
