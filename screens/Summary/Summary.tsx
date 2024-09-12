import {TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {useCallback, useMemo, useRef, useState} from 'react';
import DB, {ILog} from '@/storage/db-service';
import {Chart, DataPoint, defaultDataPoint, GRAPH_PERIOD, GRAPH_PERIOD_LABELS, GRAPH_PERIODS} from './Chart';
import {Gauge, Infinity, Ruler} from 'lucide-react-native';
import {UnitLabels} from '../Home/constants';
import {RecordItem} from './RecordItem';
import {FlashList} from '@shopify/flash-list';
import {dataRangeAtom} from '@/storage/atoms/range';
import {dataUnitAtom} from '@/storage/atoms/unit';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {DataRange} from '@/screens/Settings/components/DataRange';
import {useAtom, useAtomValue} from 'jotai';

export function Summary() {
    const {styles, theme} = useStyles(stylesheet);
    const [period, setPeriod] = useState<GRAPH_PERIOD>(GRAPH_PERIOD.MONTH);

    const [dataRange] = useAtom(dataRangeAtom);
    const [dataUnit, setDataUnit] = useAtom(dataUnitAtom);

    const dataRangeRef = useRef<BottomSheetModal>(null);
    const handleDataRange = useCallback(() => {
        dataRangeRef.current?.present();
    }, []);

    const unit = useAtomValue(dataUnitAtom);

    const data = useMemo(() => {
        const timestamp = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).getTime();
        const db = DB.getInstance();
        const res = db.getAll(timestamp);
        if (res) return res;
        return [];
    }, [unit, period]);

    const listData = useMemo(() => {
        return data.slice().reverse();
    }, [data]);

    const {highest, lowest} = useMemo(() => reduceDataPoints(data), [data]);
    const percentageRange = useMemo(() => {
        const res = data.filter(item => item.value >= dataRange.minVal && item.value <= dataRange.maxVal);
        return data.length === 0 ? 0 : (res.length / data.length) * 100;
    }, [data, dataRange]);

    const {rangeMin, rangeHigh} = useMemo(() => {
        if (unit === 'mmol') {
            return {
                rangeMin: (dataRange.minVal / 18).toFixed(1),
                rangeHigh: (dataRange.maxVal / 18).toFixed(1),
            };
        }
        return {
            rangeMin: dataRange.minVal.toFixed(0),
            rangeHigh: dataRange.maxVal.toFixed(0),
        };
    }, [unit, dataRange]);

    const toggleUnit = () => {
        setDataUnit(dataUnit === 'mg' ? 'mmol' : 'mg');
    };

    return (
        <FlashList
            data={listData}
            estimatedItemSize={50}
            contentContainerStyle={styles.container}
            renderItem={({item}) => <RecordItem {...item} />}
            ListHeaderComponent={
                <>
                    <Text>
                        Highest: {highest.value} on {new Date(highest.timestamp).toLocaleString()} ({highest.label})
                    </Text>
                    <Text>
                        Lowest: {lowest.value} on {new Date(lowest.timestamp).toLocaleString()} ({lowest.label})
                    </Text>
                    <Text>
                        Readings have been within the range {dataRange.minVal} - {dataRange.maxVal} mg{' '}
                        {percentageRange.toFixed(2)}% of the times.
                    </Text>
                    {data.length > 0 ? (
                        <View>
                            <View style={styles.graphActions}>
                                <TouchableOpacity onPress={handleDataRange} style={styles.actionWrap}>
                                    <Ruler size={18} color={theme.colors.text.primary} />
                                    <Text>
                                        {rangeMin} - {rangeHigh}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionWrap} onPress={toggleUnit}>
                                    <Gauge size={18} color={theme.colors.text.primary} />
                                    <Text>{UnitLabels[dataUnit]}</Text>
                                </TouchableOpacity>
                            </View>
                            <Chart
                                highest={highest}
                                lowest={lowest}
                                data={data}
                                period={GRAPH_PERIOD.MONTH}
                                unit={dataUnit}
                            />
                        </View>
                    ) : (
                        <View style={styles.noDataWrap}>
                            <Text variant={'h1'}>No data</Text>
                        </View>
                    )}
                    <View style={styles.selectors}>
                        {GRAPH_PERIODS.map((p, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.selector, period === p && styles.selectorSelected]}
                                    onPress={() => setPeriod(p)}>
                                    <Text style={styles.period} weight="500">
                                        {GRAPH_PERIOD_LABELS[p]}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <Text variant={'h3'} style={{marginTop: theme.spacing.xl}}>
                        Records
                    </Text>
                    <DataRange ref={dataRangeRef} />
                </>
            }
        />
    );
}

const reduceDataPoints = (data: ILog[]) => {
    if (data.length === 0) return {highest: defaultDataPoint, lowest: defaultDataPoint};
    const first = data[0];
    const highest: DataPoint = {value: first.value, timestamp: first.timestamp, label: first.label, index: 0};
    const lowest: DataPoint = {value: first.value, timestamp: first.timestamp, label: first.label, index: 0};
    return data.reduce(
        (val, item, index) => {
            if (item.value > val.highest.value) {
                highest.value = item.value;
                highest.timestamp = item.timestamp;
                highest.label = item.label;
                highest.index = index;
            } else if (item.value < val.lowest.value) {
                lowest.value = item.value;
                lowest.timestamp = item.timestamp;
                lowest.label = item.label;
                lowest.index = index;
            }
            return val;
        },
        {highest, lowest},
    );
};

const stylesheet = createStyleSheet(theme => ({
    container: {
        paddingHorizontal: theme.spacing.th,
        paddingVertical: theme.spacing.l,
        paddingBottom: theme.spacing.xxl,
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
    selectorSelected: {
        borderColor: theme.colors.primary,
        borderWidth: 2,
    },
    period: {
        fontSize: 14,
    },
    graphActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.m,
        marginTop: theme.spacing.l,
    },
    actionWrap: {
        backgroundColor: theme.card.background,
        padding: theme.spacing.m,
        borderRadius: theme.rounded.full,
        flexDirection: 'row',
        gap: theme.spacing.s,
        alignItems: 'center',
    },
    noDataWrap: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
    },
}));
