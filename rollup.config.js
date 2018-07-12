import babel from 'rollup-plugin-babel'
import vue from 'rollup-plugin-vue2';
import css from 'rollup-plugin-css-only';
import globby from 'globby'
import commonjs from 'rollup-plugin-commonjs';


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
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        plugins: ['external-helpers'],
        externalHelpers: true,
        runtimeHelpers: true
      }),
    ]
  }
})
export default configs