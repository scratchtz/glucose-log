module.exports = {
    presets: ['babel-preset-expo'],
    plugins: [
        [
            'module-resolver',
            {
                alias: {
                    '@': './',
                    crypto: 'react-native-quick-crypto',
                    buffer: '@craftzdog/react-native-buffer',
                },
            },
            'react-native-reanimated/plugin',
        ],
    ],
};
