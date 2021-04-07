const webpack = require('webpack');

module.exports = env => {
    return {
        entry: "./src/lfod-gui.js",
        mode: env.production ? 'production' : 'development',
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
