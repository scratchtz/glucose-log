import {TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {useCallback, useMemo, useRef} from 'react';
import DB, {ILog} from '@/storage/db-service';
import {Chart, DataPoint, defaultDataPoint, GRAPH_PERIOD, GRAPH_PERIODS} from './Chart';
import {Gauge, Ruler} from 'lucide-react-native';
import {RecordItem} from './RecordItem';
import {FlashList} from '@shopify/flash-list';
import {dataRangeAtom} from '@/storage/atoms/range';
import {dataUnitAtom, DefaultDataUnit} from '@/storage/atoms/unit';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {DataRange} from '@/screens/Settings/components/DataRange';
import {useAtom} from 'jotai';
import {useMMKVString} from 'react-native-mmkv';
import {StorageKeys} from '@/constants/storageKeys';
import {encryptedStorage} from '@/storage/mmkv';
import {useTranslation} from 'react-i18next';
import {deleteCounterAtom} from '@/screens/Summary/RecordItemModal';
import {useAtomValue} from 'jotai/index';
import {palette} from '@/utils/styles/palette';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export function Summary() {
    const {styles, theme} = useStyles(stylesheet);
    const [period = GRAPH_PERIOD.MONTH, setPeriod] = useMMKVString(StorageKeys.KEY_GRAPH_PERIOD, encryptedStorage);

    const [dataRange] = useAtom(dataRangeAtom);
    const [unit, setUnit] = useAtom(dataUnitAtom);

    const dataRangeRef = useRef<BottomSheetModal>(null);
    const handleDataRange = useCallback(() => {
        dataRangeRef.current?.present();
    }, []);

    const deleteCounter = useAtomValue(deleteCounterAtom);

    const data = useMemo(() => {
        const timestamp = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).getTime();
        const db = DB.getInstance();
        const res = db.getAll(timestamp);
        if (res) return res;
        return [];
    }, [unit, period, deleteCounter]);

    const listData = useMemo(() => {
        return data.slice().reverse();
    }, [data]);

    const {highest, lowest} = useMemo(() => reduceDataPoints(data), [data]);
    const percentageRange = useMemo(() => {
        const res = data.filter(item => item.value >= dataRange.minVal && item.value <= dataRange.maxVal);
        return data.length === 0 ? 0 : (res.length / data.length) * 100;
    }, [data, dataRange]);
    const {t} = useTranslation();

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
        setUnit(unit === 'mg' ? 'mmol' : 'mg');
    };

    return (
        <FlashList
            data={listData}
            estimatedItemSize={50}
            contentContainerStyle={styles.container}
            renderItem={({item}) => <RecordItem {...item} />}
            ListHeaderComponent={
                <View>
                    {data.length > 0 ? (
                        <View>
                            <View style={styles.infoWrap}>
                                <MaterialCommunityIcons name="gauge-full" style={styles.infoIcon} />
                                <Text style={styles.info}>
                                    {t('summary.highest', {
                                        value: convertData(highest.value, unit),
                                        unit: t(`constants.unit.${unit}`),
                                        date: new Date(highest.timestamp).toLocaleString(),
                                        label: highest.label,
                                    })}
                                </Text>
                            </View>
                            <View style={styles.infoWrap}>
                                <MaterialCommunityIcons name="gauge-empty" style={styles.infoIcon} />
                                <Text style={styles.info}>
                                    {t('summary.lowest', {
                                        value: convertData(lowest.value, unit),
                                        unit: t(`constants.unit.${unit}`),
                                        date: new Date(lowest.timestamp).toLocaleString(),
                                        label: lowest.label,
                                    })}
                                </Text>
                            </View>
                            <View style={styles.infoWrap}>
                                <FontAwesome6 name="chart-line" style={styles.infoIcon} />
                                <Text style={styles.info}>
                                    {t('summary.readings_in_range', {
                                        min: rangeMin,
                                        max: rangeHigh,
                                        unit: t(`constants.unit.${unit}`),
                                        percent: percentageRange.toFixed(2),
                                    })}
                                </Text>
                            </View>
                            <View style={styles.graphActions}>
                                <TouchableOpacity onPress={handleDataRange} style={styles.actionWrap}>
                                    <Ruler size={18} color={theme.colors.text.primary} />
                                    <Text>
                                        {rangeMin} - {rangeHigh}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionWrap} onPress={toggleUnit}>
                                    <Gauge size={18} color={theme.colors.text.primary} />
                                    <Text>{t('constants.unit.' + unit)}</Text>
                                </TouchableOpacity>
                            </View>
                            <Chart
                                highest={highest}
                                lowest={lowest}
                                data={data}
                                period={GRAPH_PERIOD.MONTH}
                                unit={unit}
                            />
                        </View>
                    ) : (
                        <View style={styles.noDataWrap}>
                            <Text>{t('summary.no_data')}</Text>
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
                                        {t('summary.period.' + p)}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    {data.length > 0 && (
                        <Text variant={'h3'} style={{marginTop: theme.spacing.xl}}>
                            {t('summary.records')}
                        </Text>
                    )}
                    <DataRange ref={dataRangeRef} />
                </View>
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

const convertData = (data: number, unit: DefaultDataUnit): string => {
    if (unit === 'mmol') {
        return (data / 18).toFixed(2);
    }
    return data.toString();
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
        borderColor: theme.colors.text.primary,
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
        paddingVertical: theme.spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
    },
    infoWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.m,
        marginBottom: theme.spacing.m,
    },
    info: {
        fontFamily: 'Font-400',
        color: theme.colors.text.primary,
        flex: 1,
    },
    infoIcon: {
        fontSize: 24,
        color: theme.colors.text.secondary,
    },
    pulse: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: palette.amber500,
    },
}));
