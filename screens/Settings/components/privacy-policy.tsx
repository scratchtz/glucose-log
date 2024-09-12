import {View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

export const PrivacyPolicy = () => {
    const {styles} = useStyles(stylesheet);
    return (
        <View style={styles.container}>
            <Text weight={'500'}>
                At Glucose Log, your privacy is important to us. We are committed to safeguarding your personal data and
                ensuring that your health information remains private and secure.
            </Text>
            <View style={{marginTop: 12}}></View>
            <View style={{flexDirection: 'column', gap: 12}}>
                <Text weight={'500'}>
                    <Text weight={'700'}>Data Collection:</Text>
                    Glucose Log does not collect or store any of your personal data on external servers. All information
                    related to your glucose levels is stored locally on your device.
                </Text>
                <Text weight={'500'}>
                    <Text weight={'700'}>Use of Data:</Text> The data entered into Glucose Log is used solely for
                    tracking your glucose levels and is never shared with third parties unless you choose to export and
                    share the data manually.
                </Text>
                <Text weight={'500'}>
                    <Text weight={'700'}>Third-Party Services:</Text> Glucose Log does not use any third-party services
                    for data storage, analytics, or advertising. Your data stays with you, on your device.
                </Text>
                <Text weight={'500'}>
                    <Text weight={'700'}>Security:</Text> We take reasonable measures to ensure that your data remains
                    secure on your device, but we recommend using a password or biometric lock on your phone for added
                    security.
                </Text>
                <Text weight={'500'}>
                    By using Glucose Log, you consent to this privacy policy. We reserve the right to update this
                    policy, and any changes will be posted within the app.
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
