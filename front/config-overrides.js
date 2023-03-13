const webpack = require('webpack');
const WorkBoxPlugin = require('workbox-webpack-plugin');

module.exports = function override(config) {
    config.resolve.fallback = {
        util: require.resolve('util')
    };

    // https://stackoverflow.com/questions/69135310/workaround-for-cache-size-limit-in-create-react-app-pwa-service-worker
    config.plugins = [...config.plugins, new webpack.ProvidePlugin({})];

    config.plugins = [...config.plugins, new webpack.ProvidePlugin({})];

    return config;
};
