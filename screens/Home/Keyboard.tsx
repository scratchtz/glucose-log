import {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {Delete} from 'lucide-react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';

type Props = {
    onNumberPress: (n: string) => void;
    onBackspace: () => void;
};

const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

export const Keyboard = memo(({onNumberPress, onBackspace}: Props) => {
    const {styles, theme} = useStyles(stylesheet);
    const {t} = useTranslation();

    return (
        <View style={styles.container}>
            {numbers.map((number, index) => (
                <TouchableOpacity
                    onPress={() => onNumberPress(number)}
                    key={index}
                    style={styles.wrapper}
                    accessibilityLabel={`Enter ${number}`}>
                    <Text weight={'600'} style={styles.keyNumber}>
                        {number}
                    </Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity
                onPress={onBackspace}
                style={styles.wrapper}
                accessibilityLabel={t('home.delete_last_digit')}>
                <Delete color={theme.colors.text.primary} size={24} />
            </TouchableOpacity>
        </View>
    );
});

const stylesheet = createStyleSheet(theme => ({
    container: {
        marginTop: theme.spacing.xl,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    wrapper: {
        backgroundColor: theme.card.background,
        borderRadius: theme.rounded.l,
        justifyContent: 'center',
        alignItems: 'center',
        height: '20%',
        minWidth: '30%',
        flexGrow: 1,
    },
    keyNumber: {
        fontFamily: 'Font-500',
        fontSize: 26,
    },
}));
