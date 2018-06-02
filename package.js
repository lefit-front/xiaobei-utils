const babel = require('rollup-plugin-babel')
const vue = require('rollup-plugin-vue2')
const css = require('rollup-plugin-css-only')
const rollup = require('rollup')

rollup.rollup({
  input: './src/plugins/le-date-picker/index.js',
  // input: './src/plugins/le-date-picker/index.js',
  output: {
    file: 'dist/test.js',
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
})