import {View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';

export const AboutUs = () => {
    const {styles} = useStyles(stylesheet);
    const {t} = useTranslation();
    return (
        <View style={styles.container}>
            <Text weight={'500'}>{t('about_us.info')}</Text>
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
