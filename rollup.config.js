// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

// eslint-disable-next-line no-process-env
const isProd = process.env.NODE_ENV === 'production';

const config = [
  {
    input: 'cjs/index.js',
    output: {
      file: `lib/cjs/SplitSynchronizer${isProd ? '.min' : ''}.js`,
      format: 'cjs',
      name: 'SplitSynchronizer',
    },
    plugins: [
      resolve(),
      commonjs(),
      isProd && terser(),
    ],
  },
  {
    input: 'esm/index.js',
    output: {
      file: `lib/esm/SplitSynchronizer${isProd ? '.min' : ''}.js`,
      format: 'esm',
      name: 'SplitSynchronizer',
    },
    plugins: [
      resolve(),
      commonjs(),
      isProd && terser(),
    ],
  },
  // Bundle CLI
  {
    input: 'cjs/cli.js',
    output: {
      file: `lib/cli/SplitSynchronizerCLI${isProd ? '.min' : ''}.js`,
      format: 'cjs',
      name: 'SplitSynchronizerCLI',
    },
    plugins: [
      resolve(),
      commonjs({ ignoreDynamicRequires: true }),
      isProd && terser(),
    ],
  },
];

export default config;
