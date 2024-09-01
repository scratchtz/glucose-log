import {ScrollView, TextInput, TouchableOpacity, View} from 'react-native';
import {createStyleSheet, UnistylesRuntime, useStyles} from 'react-native-unistyles';
import {Text} from '@/components/Text/Text';
import {palette} from '@/utils/styles/palette';
import {useEffect, useState} from 'react';
import {FontAwesome5} from '@expo/vector-icons';
import {addData} from '@/storage/db-service';

const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

export function Home() {
    const {styles, theme} = useStyles(stylesheet);
    const [digit, setDigit] = useState('');
    const [results, setResults] = useState(0);

    useEffect(() => {
        onCalculate();
    }, [digit]);

    function onAdd(n: string) {
        setDigit(prev => prev + n);
    }

    function onClear() {
        setDigit(prev => prev.slice(0, -1));
    }

    function onCalculate() {
        const val = parseFloat(digit);

        //find the millimoles per liter
        const res = val / 18;
        setResults(parseFloat(res.toFixed(3)));
    }

    function onSave() {
        const time = new Date();
        addData({levels: results, day: time.getDay()});

        //reset values
        setDigit('');
        setResults(0);
    }

    return (
        <View style={styles.container}>
            <View>
                <Text variant={'h1'}>Home</Text>
                <View style={styles.wrapper}>
                    <Text color={'tertiary'} weight={'400'}>
                        mmol/L
                    </Text>
                    <Text style={styles.result} color={digit ? 'primary' : 'secondary'} variant={'h1'} weight={'500'}>
                        {results || '000'}
                    </Text>
                </View>
                <View style={[styles.wrapper, {backgroundColor: theme.card.background}]}>
                    <Text color={'tertiary'} weight={'400'}>
                        mg/dL
                    </Text>
                    <Text style={[styles.result]} color={digit ? 'primary' : 'secondary'} weight={'500'} variant={'h1'}>
                        {digit || '000'}
                    </Text>
                </View>
                <View style={styles.numbers}>
                    {numbers.map((number, index) => (
                        <TouchableOpacity onPress={() => onAdd(number)} key={index}>
                            <View style={styles.number}>
                                <Text weight={'600'} style={styles.value}>
                                    {number}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={onClear}>
                        <View style={styles.number}>
                            <FontAwesome5 name={'backspace'} size={18} color={theme.colors.primary} />
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={onSave} style={styles.button}>
                    <Text variant={'h3'} weight={'600'}>
                        SAVE
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const stylesheet = createStyleSheet(theme => ({
    container: {
        paddingTop: UnistylesRuntime.insets.top,
        paddingHorizontal: theme.spacing.m,
    },
    wrapper: {
        marginTop: theme.spacing.m,
        borderWidth: 1,
        borderRadius: theme.rounded.l,
        borderColor: theme.colors.border,
        paddingVertical: theme.spacing.l,
        paddingHorizontal: theme.spacing.m,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    result: {
        paddingTop: theme.spacing.xl,
    },
    input: {
        fontSize: 32,
        color: theme.colors.text.primary,
    },
    numbers: {
        marginTop: theme.spacing.m,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing.l,
    },
    number: {
        borderRadius: theme.spacing.m,
        backgroundColor: theme.card.background,
        height: 100,
        width: 120,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    value: {
        fontSize: theme.spacing.xl,
        color: palette.rose500,
    },
    day: {
        borderRadius: theme.spacing.m,
        backgroundColor: theme.card.background,
        height: 40,
        width: 60,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: theme.colors.primary,
        marginTop: theme.spacing.xl,
        padding: theme.spacing.m,
        borderRadius: theme.spacing.m,
        alignItems: 'center',
    },
}));
