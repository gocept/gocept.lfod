const webpack = require('webpack');

module.exports = mode => {
    return {
        entry: "./src/lfod-gui.js",
        mode: mode,
        output: {
            path: __dirname + "/src",
            filename: "lfod.js"
        },
        resolve: {
            alias: {
                "jsontemplate$": "json-template-foo"
            }
        },
        plugins: [
            new webpack.ProvidePlugin({
                jQuery: 'jquery',
            }),
        ],
    }
};
