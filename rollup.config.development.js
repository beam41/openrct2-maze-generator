import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import eslint from '@rollup/plugin-eslint'
import { defineConfig } from 'rollup'
import path from 'path'

export default defineConfig({
  external: ['@/lib/openrct2'],
  input: './src/index.ts',
  output: {
    file: path.join(
      // eslint-disable-next-line no-undef
      process.env.USERPROFILE,
      'documents',
      'OpenRCT2',
      'plugin',
      'maze-generator.js'
    ),
    format: 'iife',
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    eslint(),
    typescript(),
    terser({
      compress: {
        negate_iife: false,
      },
      format: {
        quote_style: 1,
        wrap_iife: true,
      },
      keep_fnames: true,
    }),
  ],
  treeshake: 'smallest',
})
