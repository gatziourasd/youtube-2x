import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/main.ts',
  output: {
    file: 'build/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [typescript()]
};