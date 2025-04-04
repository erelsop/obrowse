import typescript from '@rollup/plugin-typescript';
import strip from '@rollup/plugin-strip';

export default {
  input: 'src/obrowse.ts',
  output: [
    {
      file: 'dist/obrowse.js',
      format: 'cjs',
      banner: '#!/usr/bin/env node',
    },
  ],
  plugins: [
    strip({
      include: '**/*.ts',
      labels: ['debug', 'assert.*', 'alert'],
      functions: ['console.log', 'assert.*', 'debug', 'alert'],
    }),
    typescript(),
  ],
};
