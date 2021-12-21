// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const config = [
  // Bundle CLI
  {
    input: 'lib/cjs/cli.js',
    output: {
      file: 'bin/splitio-sync-tools.js',
      format: 'cjs',
      // exports: 'auto', // https://rollupjs.org/guide/en/#outputexports
    },
    plugins: [
      resolve(),
      commonjs({ ignoreDynamicRequires: true }),
    ],
  },
];

export default config;
