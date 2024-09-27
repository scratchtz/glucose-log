import {ScrollView} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import Markdown from 'react-native-markdown-display';
import {markdownStyle} from '@/screens/Settings/components/markdown';

const markdown = `
# About Scratch Limited

## Our Mission

At Scratch Limited, we're on a mission to make useful apps simple and accessible for everyone. 
Glucose Log, embodies this commitment by providing an effortless way to track glucose levels.

## Who We Are

We're a team of passionate developers and health enthusiasts who believe that technology should simplify, not complicate, your life. Founded with the goal of scratching our own itch, we've grown into a company dedicated to creating user-friendly apps.

## Glucose Log

Here's what makes it special:

- **Simple Interface**: Easy to use for all ages and tech levels
- **Privacy First**: All data stored locally on your device
- **Flexible Units**: Effortlessly convert between different measurement units
- **No Sharing**: Your health data stays yours - always
- **Open Source**: Our code is transparent and customizable, check our GitHub page and edit if you like.

## Our Commitment to Openness

We believe in the power of community and transparency. That's why Glucose Log is open source:

- **Transparent Code**: Anyone can view our source code
- **Customizable**: Users with coding skills can modify the app to suit their needs
- **Community Driven**: We welcome contributions and feedback from our users

## Our Promise

We're committed to continuous improvement and user satisfaction. As we grow, we promise to:

1. Keep our products simple and intuitive
2. Prioritize user privacy and data security
3. Listen to our community and evolve with their needs
4. Maintain our commitment to open source principles

Join us in our journey to make apps simple and useful, with the added freedom of open source technology!
`;

export const AboutUs = () => {
    const {styles} = useStyles(stylesheet);
    const {styles: markdownStyles} = useStyles(markdownStyle);
    return (
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.container}
            contentContainerStyle={styles.scrollView}>
            <Markdown style={markdownStyles}>{markdown}</Markdown>
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
