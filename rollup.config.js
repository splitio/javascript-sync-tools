import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'typescript';
import ts from '@wessberg/rollup-plugin-ts';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [
    nodeResolve(),
    ts({
      typescript,
      tsconfig: './tsconfig.json'
    })
  ]
};
