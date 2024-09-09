import {ScrollView} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

export function Settings() {
    const {styles, theme} = useStyles(stylesheet);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text>Finish settings here. Things to set</Text>
            <Text>Default unit: ?</Text>
            <Text>Reset data</Text>
            <Text>Range: 80-180?</Text>

            <Text>And other information like</Text>
            <Text>About us</Text>
            <Text>Privacy policy</Text>
            <Text>Terms and conditions</Text>
            <Text>App version</Text>
            <Text>Github link with code</Text>
        </ScrollView>
    );
}

const stylesheet = createStyleSheet(theme => ({
    container: {
        paddingHorizontal: theme.spacing.th,
        paddingVertical: theme.spacing.l,
        flex: 1,
    },
}));
