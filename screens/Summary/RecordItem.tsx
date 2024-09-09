import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {Text} from '@/components/Text/Text';

export function RecordItem() {
    const {styles} = useStyles(stylesheet);
    return (
        <View style={styles.container}>
            <View style={{flex: 1}}>
                <Text weight="500">Kiazi</Text>
                <Text color="secondary">Jul 23rd 2024</Text>
            </View>
            <Text weight="600" style={styles.value}>
                280
            </Text>
        </View>
    );
}

const stylesheet = createStyleSheet(theme => ({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.m,
        backgroundColor: theme.card.background,
        borderRadius: theme.rounded.l,
    },
    value: {
        fontSize: 20,
    },
}));
