import typescript from '@rollup/plugin-typescript';
import strip from '@rollup/plugin-strip';

export default {
  input: 'src/obrowse.ts',
  output: [
    {
      file: 'dist/obrowse.js',
      format: 'cjs',
    },
  ],
  plugins: [
    strip({
      include: '**/*.ts',
      labels: ['shebang'],
      functions: ['console.log', 'assert.*', 'debug', 'alert'],
    }),
    typescript(),
  ],
};
