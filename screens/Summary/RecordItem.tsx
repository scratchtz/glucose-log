import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {Text} from '@/components/Text/Text';
import {ILog} from '@/storage/db-service';

export function RecordItem(data: ILog) {
    const {styles} = useStyles(stylesheet);
    return (
        <View style={styles.container}>
            <View style={{flex: 1}}>
                {data.label !== '' && <Text weight="500">{data.label}</Text>}
                <Text color="secondary">{new Date(data.timestamp).toLocaleString()}</Text>
            </View>
            <Text weight="600" style={styles.value}>
                {data.value}
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
        marginTop: 10,
    },
    value: {
        fontSize: 20,
    },
}));
