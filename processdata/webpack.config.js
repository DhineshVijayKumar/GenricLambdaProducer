import path from 'path';

export default {
    entry: './app.ts',
    target: 'node',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'app.js',
        path: path.resolve('.', 'dist'),
        library: { type: 'commonjs2' },
    },
    externals: {
        'aws-sdk': 'commonjs aws-sdk',
    },
};