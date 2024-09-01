import {Dimensions, View} from 'react-native';
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
            console.log(res);
        }
    }

    if (data.length === 0) {
        return (
            <View style={{alignItems: 'center', justifyContent: 'center', height: 220}}>
                <Text>No data to show</Text>
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
        <View style={styles.container}>
            <Text variant={'h1'}>SUMMARY</Text>
            <View style={{marginBottom: 20}}></View>
            <LineChart
                data={chartData}
                width={Dimensions.get('window').width - 16} // Account for padding
                height={300}
                yAxisSuffix=""
                chartConfig={{
                    backgroundColor: theme.card.background,
                    backgroundGradientFrom: theme.card.background,
                    backgroundGradientTo: theme.card.background,
                    decimalPlaces: 2,
                    color: theme.isDark
                        ? (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
                        : (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
        </View>
    );
}

const stylesheet = createStyleSheet(theme => ({
    container: {
        paddingTop: UnistylesRuntime.insets.top,
        paddingHorizontal: theme.spacing.m,
    },
}));
