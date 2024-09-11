import {TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {useCallback, useMemo, useRef, useState} from 'react';
import DB, {ILog, PercentageRange} from '@/storage/db-service';
import {useFocusEffect} from '@react-navigation/core';
import {Chart, GRAPH_PERIOD, GRAPH_PERIOD_LABELS, GRAPH_PERIODS} from './Chart';
import {Gauge, Infinity} from 'lucide-react-native';
import {UnitLabels} from '../Home/constants';
import {RecordItem} from './RecordItem';
import {FlashList} from '@shopify/flash-list';
import {useDataRange} from '@/storage/atoms/range';
import {setDataUnit, useDataUnit} from '@/storage/atoms/unit';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

type Result = {
    highest: {value: number; timestamp: number};
    lowest: {value: number; timestamp: number};
};

export function Summary() {
    const {styles, theme} = useStyles(stylesheet);
    const [data, setData] = useState<ILog[]>([]);
    const [period, setPeriod] = useState<GRAPH_PERIOD>(GRAPH_PERIOD.MONTH);
    const [percentageRange, setPercentageRange] = useState<PercentageRange | undefined>(undefined);

    const dataRange = useDataRange();
    const dataUnit = useDataUnit();

    const dataRangeRef = useRef<BottomSheetModal>(null);
    const handleDataRange = useCallback(() => {
        dataRangeRef.current?.present();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchData();
            fetchPercentageRange();
        }, [dataRange, period]),
    );

    //sub current time to get data range
    const getTime = useMemo(() => {
        switch (period) {
            case '1':
                return new Date(Date.now() - 60 * 60 * 1000).getTime();
            case '7':
                return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime();
            case '30':
                return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime();
            case '90':
                return new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).getTime();
            case '365':
                return new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).getTime();
            default:
                return Date.now();
        }
    }, [period]);

    //get the highest and lowest data levels
    const result: Result = data.reduce(
        (val, item) => ({
            highest: item.value > val.highest.value ? {value: item.value, timestamp: item.timestamp} : val.highest,
            lowest: item.value < val.lowest.value ? {value: item.value, timestamp: item.timestamp} : val.lowest,
        }),
        {
            highest: {value: 0, timestamp: 0},
            lowest: {value: Number.MAX_VALUE, timestamp: 0},
        },
    );

    function fetchData() {
        const db = DB.getInstance();
        const res = db.getAll(getTime);
        if (res) {
            setData(res);
        }
    }

    function fetchPercentageRange() {
        const db = DB.getInstance();
        const res = db.getRange(dataRange.maxVal, dataRange.minVal);
        if (res) {
            setPercentageRange(res);
        }
    }

    const toggleUnit = useCallback(() => {
        setDataUnit(dataUnit === 'mg' ? 'mmol' : 'mg');
    }, [dataUnit]);

    if (data.length < 1) {
        return (
            <View>
                <Text>No data</Text>
            </View>
        );
    }

    return (
        <View style={{flex: 1}}>
            <FlashList
                data={data}
                estimatedItemSize={50}
                contentContainerStyle={styles.container}
                renderItem={({item}) => <RecordItem {...item} />}
                ListHeaderComponent={
                    <>
                        <Text>
                            Highest: {result.highest.value} on {new Date(result.highest.timestamp).toLocaleString()}{' '}
                            (Sugar)
                        </Text>
                        <Text>
                            Lowest: {result.lowest.value} on {new Date(result.lowest.timestamp).toLocaleString()}{' '}
                            (Glucose)
                        </Text>
                        <Text>
                            Readings have been within the range {dataRange.minVal} - {dataRange.maxVal} mg{' '}
                            {percentageRange?.range}% of the times.
                        </Text>
                        <View>
                            <View style={styles.graphActions}>
                                <Text style={{fontSize: 32}} color="tertiary">
                                    {GRAPH_PERIOD_LABELS[period]}
                                </Text>
                                <TouchableOpacity onPress={handleDataRange} style={styles.actionWrap}>
                                    <Infinity size={18} color={theme.colors.text.primary} />
                                    <Text>
                                        {dataRange.minVal} - {dataRange.maxVal}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionWrap} onPress={toggleUnit}>
                                    <Gauge size={18} color={theme.colors.text.primary} />
                                    <Text>{UnitLabels[dataUnit]}</Text>
                                </TouchableOpacity>
                            </View>
                            <Chart data={data} period={GRAPH_PERIOD.MONTH} unit={dataUnit} />
                        </View>
                        <View style={styles.selectors}>
                            {GRAPH_PERIODS.map((period, index) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.selector}
                                        onPress={() => setPeriod(period)}>
                                        <Text style={styles.period} weight="500">
                                            {GRAPH_PERIOD_LABELS[period]}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <Text variant={'h3'} style={{marginTop: theme.spacing.xl}}>
                            Records
                        </Text>
                    </>
                }
            />
        </View>
    );
}

const stylesheet = createStyleSheet(theme => ({
    container: {
        paddingHorizontal: theme.spacing.th,
        paddingVertical: theme.spacing.l,
    },
    selectors: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selector: {
        backgroundColor: theme.card.background,
        padding: theme.spacing.m,
        borderRadius: theme.rounded.l,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    period: {
        fontSize: 14,
    },
    graphActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 0,
        right: 0,
        gap: theme.spacing.m,
        zIndex: 9999,
    },
    actionWrap: {
        backgroundColor: theme.card.background,
        padding: theme.spacing.m,
        borderRadius: theme.rounded.full,
        flexDirection: 'row',
        gap: theme.spacing.s,
    },
}));
