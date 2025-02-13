import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/index.js',
            format: 'umd',
            name: 'SubtitlesEditor',
            globals: {
                react: 'React',
            },
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm',
        },
    ],
    external: ['react'],
    plugins: [
        postcss(),
        babel({
            presets: ['@babel/preset-react'],
            babelHelpers: 'bundled',
        }),
    ],
};
