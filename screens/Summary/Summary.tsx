import {Dimensions, ScrollView, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, UnistylesRuntime, useStyles} from 'react-native-unistyles';
import {useCallback, useState} from 'react';
import {IData, readData} from '@/storage/db-service';
import {LineChart} from 'react-native-chart-kit';
import {useFocusEffect} from '@react-navigation/core';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Summary() {
    const {styles, theme} = useStyles(stylesheet);
    const [data, setData] = useState<IData[]>([]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, []),
    );

    function fetchData() {
        const res = readData();
        if (res) {
            setData(res);
        }
    }

    if (data.length === 0) {
        return (
            <View style={{alignItems: 'center', justifyContent: 'center', height: 220}}>
                <Text variant={'h1'}>No data to show</Text>
            </View>
        );
    }

    const chartData = {
        labels: data.map(item => {
            return days[item.day];
        }),
        datasets: [
            {
                data: data.map(item => item.levels),
            },
        ],
    };

    return (
        <ScrollView style={styles.container}>
            <View style={{marginTop: 20}}></View>
            <Text variant={'h1'}>SUMMARY</Text>
            <LineChart
                data={chartData}
                width={Dimensions.get('window').width - 16} // Account for padding
                height={350}
                chartConfig={{
                    backgroundColor: theme.card.background,
                    backgroundGradientFrom: theme.card.background,
                    backgroundGradientTo: theme.card.background,
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(244, 63, 94, ${opacity})`,
                }}
                bezier
                style={{
                    marginVertical: 12,
                    borderRadius: theme.rounded.m,
                }}
            />
            <View style={{paddingVertical: theme.spacing.s}}>
                <Text variant={'h2'}>Records</Text>
                {data.length > 0 && (
                    <>
                        <View style={styles.header}>
                            <Text weight={'500'}>Day</Text>
                            <Text weight={'500'}>Glucose Level</Text>
                        </View>
                        <View style={styles.data}>
                            {data.map((d, index) => (
                                <View key={index} style={styles.wrapper}>
                                    <Text weight={'500'}>{days[d.day]}</Text>
                                    <Text weight={'500'} variant={'h3'} style={{color: theme.colors.primary}}>
                                        {d.levels} {d.measurement}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}
            </View>
            <View style={{marginTop: 50}}></View>
        </ScrollView>
    );
}

const stylesheet = createStyleSheet(theme => ({
    container: {
        paddingTop: UnistylesRuntime.insets.top,
        paddingHorizontal: theme.spacing.m,
    },
    wrapper: {
        backgroundColor: theme.card.background,
        padding: theme.spacing.l,
        borderRadius: theme.rounded.l,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    header: {
        marginTop: theme.spacing.m,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.s,
    },
    data: {
        gap: theme.spacing.m,
        marginTop: theme.spacing.s,
    },
}));
