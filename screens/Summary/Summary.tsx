import {TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {useCallback, useMemo, useRef, useState} from 'react';
import DB from '@/storage/db-service';
import {Chart, GRAPH_PERIOD, GRAPH_PERIOD_LABELS, GRAPH_PERIODS} from './Chart';
import {Gauge, Infinity} from 'lucide-react-native';
import {UnitLabels} from '../Home/constants';
import {RecordItem} from './RecordItem';
import {FlashList} from '@shopify/flash-list';
import {dataRangeAtom} from '@/storage/atoms/range';
import {dataUnitAtom} from '@/storage/atoms/unit';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {DataRange} from '@/screens/Settings/components/DataRange';
import {getDefaultStore, useAtomValue} from 'jotai/index';

type Result = {
    highest: {value: number; timestamp: number};
    lowest: {value: number; timestamp: number};
};

export function Summary() {
    const {styles, theme} = useStyles(stylesheet);
    const [period, setPeriod] = useState<GRAPH_PERIOD>(GRAPH_PERIOD.MONTH);

    const dataRange = useAtomValue(dataRangeAtom);
    const dataUnit = useAtomValue(dataUnitAtom);

    const dataRangeRef = useRef<BottomSheetModal>(null);
    const handleDataRange = useCallback(() => {
        dataRangeRef.current?.present();
    }, []);

    const data = useMemo(() => {
        const timestamp = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).getTime();
        const db = DB.getInstance();
        const res = db.getAll(timestamp);
        if (res) {
            return res;
        }
        return [];
    }, [period]);

    const result: Result =
        data.length === 0
            ? {
                  highest: {value: 0, timestamp: 0},
                  lowest: {value: 0, timestamp: 0},
              }
            : data.length === 1
              ? {
                    highest: {value: data[0].value, timestamp: data[0].timestamp},
                    lowest: {value: data[0].value, timestamp: data[0].timestamp},
                }
              : data.reduce(
                    (val, item) => ({
                        highest:
                            item.value > val.highest.value
                                ? {value: item.value, timestamp: item.timestamp}
                                : val.highest,
                        lowest:
                            item.value < val.lowest.value ? {value: item.value, timestamp: item.timestamp} : val.lowest,
                    }),
                    {
                        highest: {value: data[0].value, timestamp: data[0].timestamp},
                        lowest: {value: data[0].value, timestamp: data[0].timestamp},
                    },
                );

    const percentageRange = useMemo(() => {
        const res = data.filter(item => item.value >= dataRange.minVal && item.value <= dataRange.maxVal);
        return data.length === 0 ? 0 : (res.length / data.length) * 100;
    }, [data, dataRange]);

    const toggleUnit = useCallback(() => {
        getDefaultStore().set(dataUnitAtom, dataUnit === 'mg' ? 'mmol' : 'mg');
    }, [dataUnit]);

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
                            {percentageRange.toFixed(2)}% of the times.
                        </Text>
                        {data.length > 0 ? (
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
                        ) : (
                            <View style={styles.noDataWrap}>
                                <Text variant={'h1'}>No data</Text>
                            </View>
                        )}
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
                        <DataRange ref={dataRangeRef} />
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
    noDataWrap: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
    },
}));
