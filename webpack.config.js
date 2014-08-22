module.exports = {
    entry: "./src/gocept/lfod/static/lfod-gui.js",
    output: {
        path: __dirname + "/src/gocept/lfod/static/",
        filename: "lfod.js"
    },
    resolve: {
        alias: {
            "^jsontemplate$": "json-template-foo"
        }
    },
    module: {
        loaders: [
            {
                test: /json-template\.js/,
                loader: "imports?exports=>{}!exports?exports"
            },
            {
                test: /jquery\.blockUI\.js/,
                loader: "imports?jQuery=jquery"
            },
        ]
    }
};
