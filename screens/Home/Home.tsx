import {TextInput, TouchableOpacity, View} from 'react-native';
import {createStyleSheet, UnistylesRuntime, useStyles} from 'react-native-unistyles';
import {Text} from '@/components/Text/Text';
import {palette} from '@/utils/styles/palette';
import {useEffect, useState} from 'react';
import {Entypo, FontAwesome5} from '@expo/vector-icons';
import {addData} from '@/storage/db-service';

const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];
export type measurement = 'mmol' | 'mg';
export function Home({navigation}: any) {
    const {styles, theme} = useStyles(stylesheet);
    const [input, setInput] = useState('');
    const [results, setResults] = useState('');
    const [isSelected, setIsSelected] = useState<measurement>('mmol');

    useEffect(() => {
        onCalculate();
    }, [input]);

    function onSelect(d: measurement) {
        setIsSelected(d);
    }

    function onAdd(n: string) {
        setInput(prev => prev + n);
    }

    function onClear() {
        setInput(prev => prev.slice(0, -1));
    }

    function onCalculate() {
        if (!input) {
            return;
        }

        if (input.split('.').length > 2) {
            return;
        }

        const val = parseFloat(input);

        //find the millimoles per liter
        if (isSelected === 'mg') {
            const res = val / 18;
            setResults(res.toFixed(2));
        } else {
            const res = val * 18;
            setResults(res.toFixed(2));
        }
    }
    function onSave() {
        const time = new Date();
        addData({
            levels: isSelected === 'mmol' ? parseFloat(input) : parseFloat(results),
            measurement: 'mmol/L',
            day: time.getDay(),
        });

        //reset values
        setInput('');
        setResults('');
    }

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.iconsWrapper}>
                    <TouchableOpacity onPress={onSave} style={styles.icon}>
                        <Entypo name={'save'} size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Summary')} style={styles.icon}>
                        <Entypo name={'bar-graph'} size={30} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => onSelect('mmol')}
                    style={[styles.wrapper, isSelected === 'mmol' && styles.selected]}>
                    <Text color={'tertiary'} weight={'400'}>
                        mmol/L
                    </Text>
                    <TextInput
                        style={[styles.result, styles.input]}
                        editable={false}
                        placeholder={'000'}
                        value={isSelected === 'mmol' ? input : results}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onSelect('mg')}
                    style={[styles.wrapper, isSelected === 'mg' && styles.selected]}>
                    <Text color={'tertiary'} weight={'400'}>
                        mg/dL
                    </Text>
                    <TextInput
                        style={[styles.result, styles.input]}
                        editable={false}
                        placeholder={'000'}
                        value={isSelected === 'mg' ? input : results}
                    />
                </TouchableOpacity>
                <View style={styles.numbers}>
                    {numbers.map((number, index) => (
                        <TouchableOpacity onPress={() => onAdd(number)} key={index}>
                            <View style={styles.number}>
                                <Text weight={'700'} style={styles.value}>
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
    input: {
        fontSize: 34,
        color: theme.colors.text.primary,
    },
    result: {
        paddingTop: theme.spacing.xl,
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
        fontSize: theme.spacing.xxl,
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
    icon: {
        backgroundColor: theme.colors.primary,
        marginTop: theme.spacing.xl,
        padding: theme.spacing.m,
        borderRadius: theme.spacing.l,
        alignItems: 'center',
    },
    selected: {
        backgroundColor: theme.card.background,
        borderWidth: 1,
        borderColor: theme.card.border,
    },
    iconsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
}));
