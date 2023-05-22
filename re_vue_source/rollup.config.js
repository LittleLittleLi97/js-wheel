import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'

export default {
    input: './src/index.js',
    output: {
        file: './dist/vue.js',
        name: 'Vue', // 在全局挂上Vue
        format: 'umd', // 打包模式，esm es6 commonjs等
        sourcemap: true
    },
    plugins: [
        babel({
            exclude: "node_modules/**"
        }),
        resolve()
    ]
}