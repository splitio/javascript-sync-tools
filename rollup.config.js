// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const config = [
  // Bundle CLI
  {
    input: 'lib/cjs/cli.js',
    output: {
      file: 'bin/splitio-node-synchronizer.js',
      format: 'cjs',
      name: 'SplitSynchronizerCLI',
      exports: 'auto',
    },
    plugins: [
      resolve(),
      commonjs({ ignoreDynamicRequires: true }),
    ],
  },
];

export default config;
