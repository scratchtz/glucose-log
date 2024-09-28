import {Pressable, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {Text} from '@/components/Text/Text';
import {ILog} from '@/storage/db-service';
import {dataUnitAtom} from '@/storage/atoms/unit';
import {useAtomValue} from 'jotai/index';
import {RecordItemModal} from '@/screens/Summary/RecordItemModal';
import {useCallback, useRef} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

export function RecordItem(data: ILog) {
    const {styles} = useStyles(stylesheet);
    const unit = useAtomValue(dataUnitAtom);
    const modalRef = useRef<BottomSheetModal>(null);

    const onPress = useCallback(() => {
        modalRef.current?.present();
    }, []);

    return (
        <>
            <Pressable onPress={onPress} style={styles.container}>
                <View style={{flex: 1}}>
                    {data.label !== '' && <Text weight="500">{data.label}</Text>}
                    <Text color="secondary">{new Date(data.timestamp).toLocaleString()}</Text>
                </View>
                <Text weight="600" style={styles.value}>
                    {unit === 'mmol' ? (data.value / 18).toFixed(1) : data.value}
                </Text>
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
    value: {
        fontSize: 20,
    },
}));
