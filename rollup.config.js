import babel from 'rollup-plugin-babel'
import vue from 'rollup-plugin-vue2';
import css from 'rollup-plugin-css-only';
import globby from 'globby'
// import buble from 'rollup-plugin-buble';
// import nodeResolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';
// import {uglify} from 'rollup-plugin-uglify';

let configs = globby.sync('./src/plugins/**/index.js').map(inputFile => {
  let result = inputFile.match(/([^/]*)\/([^/]*)\.js$/)
  return {
    input: inputFile,
    output: {
      file: `dist/${result[1]}.min.js`,
      format: 'es',
    },
    plugins: [
      vue(),
      css(),
      // buble(),
      // nodeResolve({ browser: true, jsnext: true, main: true }),
      // commonjs(),
      // uglify(),
      babel({
        exclude: 'node_modules/**',
        plugins: ['external-helpers'],
        externalHelpers: true,
        runtimeHelpers: true
      })
    ]
  }
})
export default configs