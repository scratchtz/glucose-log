import {View} from 'react-native';
import {Text} from '@/components/Text/Text';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';

export const PrivacyPolicy = () => {
    const {styles} = useStyles(stylesheet);
    const {t} = useTranslation();
    return (
        <View style={styles.container}>
            <Text weight={'500'}>{t('privacy.description')}</Text>
            <View style={{marginTop: 12}}></View>
            <View style={{flexDirection: 'column', gap: 12}}>
                <Text weight={'500'}>
                    <Text weight={'700'}>{t('privacy.data_collection')}:</Text>
                    {t('privacy.data_collection_info')}
                </Text>
                <Text weight={'500'}>
                    <Text weight={'700'}>{t('privacy.use_of_data')}:</Text> {t('privacy.use_of_data_info')}
                </Text>
                <Text weight={'500'}>
                    <Text weight={'700'}>{t('privacy.third_party')}:</Text> {t('privacy.third_party_info')}
                </Text>
                <Text weight={'500'}>
                    <Text weight={'700'}>{t('privacy.security')}:</Text> {t('privacy.security_info')}
                </Text>
                <Text weight={'500'}>{t('privacy.closing')}</Text>
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
