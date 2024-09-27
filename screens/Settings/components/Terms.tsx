import {ScrollView} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Markdown from 'react-native-markdown-display';
import {markdownStyle} from '@/screens/Settings/components/markdown';

const terms = `
# Terms and Conditions for Glucose Log

## 1. Acceptance of Terms

By downloading, installing, or using Glucose Log ("the App"), you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not use our App.

## 2. Use of the App

### 2.1 License
Scratch Limited grants you a limited, non-exclusive, non-transferable license to use Glucose Log for your personal, non-commercial purposes.

### 2.2 Restrictions
You agree not to:
- Modify, distribute, or create derivative works based on the App
- Use the App for any illegal purpose
- Attempt to gain unauthorized access to any portion of the App

## 3. Open Source

### 3.1 Availability
The source code for Glucose Log is openly available for review and modification.

### 3.2 Contributions
If you choose to contribute to the App's development, you agree that your contributions will be licensed under the same open source license as the original code.

## 4. User Data and Privacy

### 4.1 Local Storage
All data entered into the App is stored locally on your device. We do not collect, store, or transmit your personal data.

### 4.2 User Responsibility
You are responsible for securing your device and the data stored within the App.

## 5. Disclaimer of Warranties

The App is provided "as is" without any warranties, expressed or implied. Scratch Limited does not warrant that the App will be error-free or uninterrupted.

## 6. Limitation of Liability

Scratch Limited shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the App.

## 7. Medical Disclaimer

Glucose Log is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## 8. Changes to the App and Terms

We reserve the right to modify or discontinue the App at any time. We may also revise these Terms and Conditions at any time. By continuing to use the App after such changes, you agree to be bound by the revised terms.

## 9. Governing Law

These Terms shall be governed by and construed in accordance with the laws of The United Republic of Tanzania, without regard to its conflict of law provisions.

## 10. Contact Information

If you have any questions about these Terms, please contact us at:

dev@scratch.co.tz
Last updated: 2024 Sep 27
`;

export const Terms = () => {
    const {styles} = useStyles(stylesheet);
    const {styles: markdownStyles} = useStyles(markdownStyle);
    return (
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.container}
            contentContainerStyle={styles.scrollView}>
            <Markdown style={markdownStyles}>{terms}</Markdown>
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
