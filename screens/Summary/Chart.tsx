import {ScrollView, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, UnistylesRuntime, useStyles} from 'react-native-unistyles';
import {useCallback, useMemo, useState} from 'react';
import DB, {ILog} from '@/storage/db-service';
import {useFocusEffect} from '@react-navigation/core';
import {CartesianChart, Line} from 'victory-native';

type Props = {};

export const Chart = () => {
    const DATA = Array.from({length: 31}, (_, i) => ({
        day: i,
        lowTmp: 20 + 10 * Math.random(),
        highTmp: 40 + 30 * Math.random(),
    }));

    const {styles, theme} = useStyles(stylesheet);
    return (
        <View style={styles.chart}>
            <CartesianChart
                data={DATA} // 👈 specify your data
                xKey="day" // 👈 specify data key for x-axis
                yKeys={['lowTmp', 'highTmp']} // 👈 specify data keys used for y-axis
                axisOptions={{}} // 👈 we'll generate axis labels using given font.
            >
                {({points}) => (
                    <Line
                        points={points.highTmp}
                        color={theme.colors.text.primary}
                        strokeWidth={2}
                        curveType="natural"
                        animate={{type: 'timing', duration: 200}}
                    />
                )}
            </CartesianChart>
        </View>
    );
};

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
