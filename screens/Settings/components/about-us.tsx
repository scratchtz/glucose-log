import {View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

export const AboutUs = () => {
    const {styles} = useStyles(stylesheet);
    return (
        <View style={styles.container}>
            <Text weight={'500'}>
                We are a team passionate individuals dedicated to helping people manage their health with ease and
                privacy. Our app, Glucose Log, is designed to provide a simple and secure way to track glucose levels.
                We believe in empowering users by giving them full control over their data, stored entirely on their
                devices with no third-party servers involved. Our mission is to provide a reliable, user-friendly tool
                that makes managing glucose levels accessible to everyone.
            </Text>
            <View style={{marginTop: 13}}></View>
            <Text weight={'300'}>Scratch Limited....</Text>
        </View>
    );
};

const stylesheet = createStyleSheet(theme => ({
    container: {
        padding: theme.spacing.m,
    },
}));
