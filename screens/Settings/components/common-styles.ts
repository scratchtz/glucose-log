import {createStyleSheet} from 'react-native-unistyles';

export const commonStyles = createStyleSheet(theme => ({
    container: {
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        marginHorizontal: theme.spacing.th,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    closeWrap: {
        borderRadius: theme.rounded.full,
        backgroundColor: theme.colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        width: 24,
        height: 24,
    },
    close: {
        fontSize: 18,
        color: theme.colors.text.primary,
    },
    scrollView: {
        marginHorizontal: theme.spacing.th,
        marginTop: theme.spacing.l,
    },
    indicator: {
        backgroundColor: theme.colors.text.tertiary,
    },
    unit: {
        borderRadius: theme.rounded.l,
        padding: theme.spacing.l,
        alignItems: 'center',
        backgroundColor: theme.card.background,
    },
}));
