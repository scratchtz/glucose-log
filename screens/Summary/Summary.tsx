import {TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {useCallback, useState} from 'react';
import DB, {ILog, IValues, PercentageRange} from '@/storage/db-service';
import {useFocusEffect} from '@react-navigation/core';
import {Chart, GRAPH_PERIOD, GRAPH_PERIOD_LABELS, GRAPH_PERIODS} from './Chart';
import {Gauge} from 'lucide-react-native';
import {Unit, UnitLabels} from '../Home/constants';
import {RecordItem} from './RecordItem';
import {FlashList} from '@shopify/flash-list';
import {useDataRange} from '@/storage/atoms/range';
import {useDataUnit} from '@/storage/atoms/unit';

export function Summary() {
    const {styles, theme} = useStyles(stylesheet);
    const [data, setData] = useState<ILog[]>([]);
    const [period, setPeriod] = useState<GRAPH_PERIOD>(GRAPH_PERIOD.MONTH);
    const [unit, setUnit] = useState<Unit>('mg');
    const [values, setValues] = useState<IValues | undefined>(undefined);
    const [percentageRange, setPercentageRange] = useState<PercentageRange | undefined>(undefined);

    const dataRange = useDataRange();
    const dataUnit = useDataUnit();

    useFocusEffect(
        useCallback(() => {
            fetchData();
            fetchMaxAndMinValues();
            fetchPercentageRange();
        }, [dataRange]),
    );

    function fetchData() {
        const db = DB.getInstance();
        const res = db.getAll();
        if (res) {
            setData(res);
        }
    }

    function fetchMaxAndMinValues() {
        const db = DB.getInstance();
        const res = db.getMaxAndMinValue();
        if (res) {
            setValues(res);
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
        setUnit(unit === 'mg' ? 'mmol' : 'mg');
    }, [unit]);

    if (!data || data.length === 0) {
        return (
            <View style={styles.container}>
                <Text variant={'h1'}>No data to show</Text>
            </View>
        );
    }
    if (!values) {
        return;
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
                            Highest: {values.max_value} on {new Date(values.max_timestamp).toLocaleString()} (Sugar)
                        </Text>
                        <Text>
                            Lowest: {values.min_value} on {new Date(values.min_timestamp).toLocaleString()} (Glucose)
                        </Text>
                        <Text>
                            Readings have been within the range {dataRange.minVal} - {dataRange.maxVal} {dataUnit}{' '}
                            {percentageRange?.range}% of the times.
                        </Text>
                        <View>
                            <View style={styles.graphActions}>
                                <Text style={{fontSize: 32}} color="tertiary">
                                    {GRAPH_PERIOD_LABELS[period]}
                                </Text>
                                <TouchableOpacity style={styles.actionWrap} onPress={toggleUnit}>
                                    <Gauge size={18} color={theme.colors.text.primary} />
                                    <Text>{UnitLabels[unit]}</Text>
                                </TouchableOpacity>
                            </View>
                            <Chart data={data} period={GRAPH_PERIOD.MONTH} unit={unit} />
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
