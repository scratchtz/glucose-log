import {View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';

export const Terms = () => {
    const {styles} = useStyles(stylesheet);
    const {t} = useTranslation();
    return (
        <View style={styles.container}>
            <Text weight={'500'}>{t('terms.description')}</Text>
            <View style={{marginTop: 12}}></View>
            <View style={{flexDirection: 'column', gap: 12}}>
                <Text weight={'500'}>
                    <Text weight={'700'}>{t('terms.use_of_app')}:</Text>
                    {t('terms.use_of_app_info')}
                </Text>
                <Text weight={'500'}>
                    <Text weight={'700'}>{t('terms.data_responsibility')}:</Text> {t('terms.data_responsibility_info')}
                </Text>
                <Text weight={'500'}>
                    <Text weight={'700'}>{t('terms.medical_advice')}:</Text> {t('terms.medical_advice_info')}
                </Text>
                <Text weight={'500'}>
                    <Text weight={'700'}>{t('terms.modifications')}:</Text> {t('terms.modifications_info')}
                </Text>
                <Text weight={'500'}>{t('terms.closing')}</Text>
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
