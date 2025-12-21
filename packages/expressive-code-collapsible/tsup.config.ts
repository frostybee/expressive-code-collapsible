import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  outExtension({ format }) {
    return {
      js: '.js'
    }
  }
});