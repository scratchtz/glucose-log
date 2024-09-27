import {createStyleSheet} from 'react-native-unistyles';

export const markdownStyle = createStyleSheet(theme => ({
    body: {
        fontFamily: 'Font-400',
        color: theme.colors.text.primary,
        fontSize: 16,
    },
    heading1: {
        fontFamily: 'Font-700',
        color: theme.colors.text.primary,
        fontSize: 24,
        marginTop: 12,
    },
    heading2: {
        fontFamily: 'Font-700',
        color: theme.colors.text.primary,
        fontSize: 20,
        marginTop: 12,
    },
    heading3: {
        fontFamily: 'Font-700',
        color: theme.colors.text.primary,
        fontSize: 18,
    },
    link: {
        color: theme.colors.primary,
    },
    hr: {
        backgroundColor: theme.colors.border,
        height: 1,
    },
}));
