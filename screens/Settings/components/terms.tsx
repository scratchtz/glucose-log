import {View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

export const Terms = () => {
    const {styles} = useStyles(stylesheet);
    return (
        <View style={styles.container}>
            <Text weight={'500'}>
                Please read these Terms and Conditions carefully before using the Glucose Log app.
            </Text>
            <View style={{marginTop: 12}}></View>
            <View style={{flexDirection: 'column', gap: 12}}>
                <Text weight={'500'}>
                    <Text weight={'700'}>Use of the App:</Text>
                    By downloading and using Glucose Log, you agree to use the app in accordance with these Terms. The
                    app is intended for personal use only and may not be used for any commercial purposes.
                </Text>
                <Text weight={'500'}>
                    <Text weight={'700'}>Data Responsibility:</Text> All data entered into the app is stored on your
                    device. Glucose Log is not responsible for any loss of data due to device malfunctions, deletion of
                    the app, or other circumstances. We recommend regularly backing up your device.
                </Text>
                <Text weight={'500'}>
                    <Text weight={'700'}>No Medical Advice:</Text> The app is designed to help you track glucose levels
                    but does not provide any medical advice. Always consult with a healthcare professional for advice
                    related to your health.
                </Text>
                <Text weight={'500'}>
                    <Text weight={'700'}>Modifications:</Text> We reserve the right to modify or discontinue the app at
                    any time without notice. Any updates to the Terms will be made available within the app.
                </Text>
                <Text weight={'500'}>
                    By using Glucose Log, you agree to these Terms. If you do not agree, please discontinue use of the
                    app.
                </Text>
            </View>
        </View>
    );
};

const stylesheet = createStyleSheet(theme => ({
    container: {
        paddingTop: theme.spacing.m,
        paddingHorizontal: theme.spacing.l,
    },
}));
