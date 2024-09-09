import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, UnistylesRuntime, useStyles} from 'react-native-unistyles';
import {useCallback, useState} from 'react';
import DB, {ILog} from '@/storage/db-service';
import {useFocusEffect} from '@react-navigation/core';
import {Chart, GRAPH_PERIOD, GRAPH_PERIOD_LABELS, GRAPH_PERIODS} from './Chart';
import {Gauge} from 'lucide-react-native';
import {Unit, UnitLabels} from '../Home/constants';
import {RecordItem} from './RecordItem';

export function Summary() {
    const {styles, theme} = useStyles(stylesheet);
    const [data, setData] = useState<ILog[]>([]);
    const [period, setPeriod] = useState<GRAPH_PERIOD>(GRAPH_PERIOD.MONTH);
    const [unit, setUnit] = useState<Unit>('mg');

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, []),
    );

    function fetchData() {
        const db = DB.getInstance();
        const res = db.getAll();
        if (res) {
            setData(res);
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

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text>Highest: 234 on Jul 23rd 2024 (Sugar)</Text>
            <Text>Lowest: 10 on Jan 20th 2024 (Glucose)</Text>
            <Text>Readings have been within the range 80 - 180 mg/dL 80% of the times.</Text>
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
                <Chart period={GRAPH_PERIOD.MONTH} unit={unit} />
            </View>
            <View style={styles.selectors}>
                {GRAPH_PERIODS.map(period => {
                    return (
                        <TouchableOpacity style={styles.selector} onPress={() => setPeriod(period)}>
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
            <View style={{gap: theme.spacing.m}}>
                <RecordItem />
                <RecordItem />
            </View>
        </ScrollView>
    );
}

const stylesheet = createStyleSheet(theme => ({
    container: {
        paddingHorizontal: theme.spacing.th,
        paddingVertical: theme.spacing.l,
        flex: 1,
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
