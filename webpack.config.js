var path = require('path');

module.exports = {
    entry: {
        task: path.resolve(__dirname, './public/javascripts/task.mjs')
    },
    output: {
        path: path.resolve(__dirname, './public/javascripts'),
        filename: '[name]_bundle.js'
    },
    mode: 'development',
    module: {
        rules: [
            {
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
    

};
