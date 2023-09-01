import { defineConfig } from 'vite';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import minifyLiterals from 'rollup-plugin-minify-html-literals-v3';
import { partytownRollup, partytownVite } from '@builder.io/partytown/utils';

export default defineConfig({
  plugins: [
      tsconfigPaths(),
  ]
    ,
  server: {
    origin: 'http://localhost:5173',
  },
  build: {
      minify: true,
      plugins: [
        partytownVite({
            dest: path.join(__dirname, 'dist', '~partytown'),
        }),
      ],

    manifest: true,
    rollupOptions: {
      plugins: [
          minifyLiterals(),
          partytownRollup({
            dest: path.join(__dirname, 'dist', '~partytown'),
          })
      ],
      treeshake: {
        manualPureFunctions: ['html'],
      },
      // Add tsconfig
      input: 'client/main.ts',
    },
  },
});
