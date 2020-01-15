const path = require('path');

const buildPath = path.resolve(__dirname, 'dist');
const srcPath = path.resolve(__dirname, 'src');

module.exports = {
    devtool: 'source-map',
    entry: path.resolve(srcPath, 'index.ts'),
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/,
            },
        ],
    },
    output: {
        filename: `webvoxel-plugin-reach.min.js`,
        path: buildPath,
        library: 'Voxel',
        libraryTarget: 'umd',
        globalObject: 'this',
    },
    resolve: {
        extensions: [
            '.ts',
            '.js',
        ],
    },
    externals: {
        three: {
            root: 'THREE',
            commonjs: 'three',
            commonjs2: 'three',
            amd: 'three',
        },
        '@webvoxel/core': {
            root: 'Voxel',
            commonjs: '@webvoxel/core',
            commonjs2: '@webvoxel/core',
            amd: '@webvoxel/core',
        },
    },
};