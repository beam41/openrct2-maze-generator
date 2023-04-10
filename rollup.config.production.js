import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import del from 'rollup-plugin-delete'
import { defineConfig } from 'rollup'
import eslint from '@rollup/plugin-eslint'

export default defineConfig({
  external: ['@/lib/openrct2'],
  input: './src/index.ts',
  output: {
    file: './build/maze-generator.js',
    format: 'iife',
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    eslint(),
    typescript(),
    terser({
      compress: {
        passes: 5,
        negate_iife: false,
      },
      format: {
        quote_style: 1,
        wrap_iife: true,
      },
    }),
    del({ targets: './build/*' }),
  ],
  treeshake: 'smallest',
})
