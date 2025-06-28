import typescript from '@rollup/plugin-typescript';
import strip from '@rollup/plugin-strip';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/obrowse.ts',
  output: [
    {
      file: 'dist/obrowse.js',
      format: 'cjs',
      banner: '#!/usr/bin/env node',
    },
  ],
  external: ['playwright', 'yargs', 'fs', 'path', 'child_process', 'os'],
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    strip({
      include: '**/*.ts',
      labels: ['debug', 'assert.*', 'alert'],
      functions: ['console.log', 'assert.*', 'debug', 'alert'],
    }),
  ],
};
