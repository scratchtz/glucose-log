import {ScrollView, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, UnistylesRuntime, useStyles} from 'react-native-unistyles';
import {useCallback, useMemo, useState} from 'react';
import DB, {ILog} from '@/storage/db-service';
import {useFocusEffect} from '@react-navigation/core';
import {CartesianChart, Line} from 'victory-native';

export function Summary() {
    const {styles, theme} = useStyles(stylesheet);
    const [data, setData] = useState<ILog[]>([]);

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

    const chartData = useMemo(() => {
        if (!data) return [];
    }, [data]);

    if (!data || data.length === 0) {
        return (
            <View style={styles.container}>
                <Text variant={'h1'}>No data to show</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text variant={'h1'}>Summary</Text>
            <Chart />
        </ScrollView>
    );
}

const stylesheet = createStyleSheet(theme => ({
    container: {
        paddingTop: UnistylesRuntime.insets.top,
        paddingHorizontal: theme.spacing.th,
        flex: 1,
    },
    chart: {
        width: UnistylesRuntime.screen.width - theme.spacing.th * 2,
        height: 300,
    },
}));
