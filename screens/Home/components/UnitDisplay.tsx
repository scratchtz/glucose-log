import {TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {Text} from '@/components/Text/Text';
import {DefaultDataUnit} from '@/storage/atoms/unit';
import {useTranslation} from 'react-i18next';
import {palette} from '@/utils/styles/palette';

type Props = {
    unit: DefaultDataUnit;
    value: string;
    isSelected: boolean;
    onPress: () => void;
};

export const UnitDisplay = memo(({unit, value, isSelected, onPress}: Props) => {
    const {styles} = useStyles(stylesheet);
    const {t} = useTranslation();

    const unitLabel = t('constants.unit.' + unit);
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.wrapper, isSelected && styles.wrapperSelected]}
            accessibilityLabel={t('home.select_label', {unitLabel: unitLabel})}>
            <View style={styles.titleWrap}>
                {isSelected && <View style={styles.pulse} />}
                <Text variant="h3">{unitLabel}</Text>
            </View>
            <Text style={styles.input}>{value}</Text>
        </TouchableOpacity>
    );
});

const stylesheet = createStyleSheet(theme => ({
    wrapper: {
        padding: theme.spacing.l,
        justifyContent: 'space-between',
        borderRadius: theme.rounded.l,
        flex: 1,
    },
    wrapperSelected: {
        backgroundColor: theme.card.background,
        borderColor: theme.card.border,
    },
    input: {
        color: theme.colors.text.primary,
        fontFamily: 'Font-700',
        alignSelf: 'flex-end',
        fontSize: 80,
    },
    titleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pulse: {
        backgroundColor: palette.blue500,
        borderRadius: theme.rounded.l,
        marginRight: theme.spacing.xs,
        width: 8,
        height: 8,
    },
}));
