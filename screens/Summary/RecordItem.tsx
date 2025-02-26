import {Pressable, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {Text} from '@/components/Text/Text';
import {ILog} from '@/storage/db-service';
import {dataUnitAtom} from '@/storage/atoms/unit';
import {useAtomValue} from 'jotai/index';
import {RecordItemModal} from '@/screens/Summary/RecordItemModal';
import {useCallback, useRef} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {palette} from '@/utils/styles/palette';
import {useTranslation} from 'react-i18next';

export function RecordItem(data: ILog) {
    const unit = useAtomValue(dataUnitAtom);
    const modalRef = useRef<BottomSheetModal>(null);
    const {t} = useTranslation();

    const variant =
        data.value >= 70 && data.value < 100
            ? 'clean'
            : data.value < 70
              ? 'danger'
              : data.value > 100 && data.value < 140
                ? 'warning'
                : 'danger';
    const {styles} = useStyles(stylesheet, {variant});

    const onPress = useCallback(() => {
        modalRef.current?.present();
    }, []);

    return (
        <>
            <Pressable onPress={onPress} style={styles.container}>
                <View style={{flex: 1}}>
                    {data.label !== '' && <Text weight="500">{data.label}</Text>}
                    <Text color="tertiary">{new Date(data.timestamp).toLocaleString()}</Text>
                </View>
                <View style={styles.valueWrap}>
                    <Text weight="500" style={styles.value}>
                        {unit === 'mmol' ? (data.value / 18).toFixed(1) : data.value}
                    </Text>
                    <Text style={styles.unit}>{t(`constants.unit.${unit}`)}</Text>
                </View>
            </Pressable>
            <RecordItemModal ref={modalRef} {...data} />
        </>
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
    valueWrap: {
        alignItems: 'flex-end',
    },
    unit: {
        fontSize: 12,
        color: theme.colors.text.tertiary,
    },
    value: {
        fontSize: 26,
        variants: {
            variant: {
                danger: {
                    color: palette.rose500,
                },
                warning: {
                    color: palette.amber500,
                },
                clean: {
                    color: theme.colors.text.primary,
                },
            },
        },
    },
}));
