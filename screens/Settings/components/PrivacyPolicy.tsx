import {ScrollView} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {markdownStyle} from '@/screens/Settings/components/markdown';
import Markdown from 'react-native-markdown-display';

const privacyPolicy = `
# Privacy Policy for Glucose Log

## Introduction

Your privacy is critically important to us at Scratch Limited. This Privacy Policy outlines our practices concerning the collection, use, and protection of your personal information when you use our Glucose Log application.

## Information Collection and Use

### Data Storage
- All data entered into Glucose Log is stored locally on your device.
- We do not collect, transmit, or store any of your personal data or glucose readings on our servers.

### Personal Information
- We do not require you to create an account or provide any personal information to use Glucose Log.

## Data Protection

### Local Storage
- Your glucose readings and any other data you input are stored solely on your device.
- We recommend using your device's built-in security features (like password protection or biometric locks) to protect your data.

### No Data Transmission
- Glucose Log does not transmit any of your data over the internet.
- There is no cloud backup or synchronization feature to ensure your data remains only on your device.

## Third-Party Access

- We do not sell, trade, or otherwise transfer your information to third parties.
- As the application runs entirely on your device without internet connectivity for its core functions, third parties do not have access to your data through our app.

## Open Source

- Glucose Log is open source software.
- The source code is available for review, which allows security experts and users to verify our privacy and data handling practices.

## Changes to This Policy

We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the application.

## Contact Us

If you have any questions about this Privacy Policy, please contact us at:

dev@scratch.co.tz

Last updated: 2024 Sep 27
`;

export const PrivacyPolicy = () => {
    const {styles} = useStyles(stylesheet);
    const {styles: markdownStyles} = useStyles(markdownStyle);
    return (
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.container}
            contentContainerStyle={styles.scrollView}>
            <Markdown style={markdownStyles}>{privacyPolicy}</Markdown>
        </ScrollView>
    );
};

const stylesheet = createStyleSheet(theme => ({
    container: {
        flex: 1,
        height: '100%',
    },
    scrollView: {
        marginHorizontal: theme.spacing.th,
    },
}));
