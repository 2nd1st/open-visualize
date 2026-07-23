import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Retroemu',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      // @ov/runtime resolves through the dev alias below and is bundled so the
      // emitted browser module has no separate runtime CDN dependency.
      external: [],
    },
  },
  resolve: {
    alias: {
      '@ov/runtime': path.resolve(__dirname, '../runtime/src/index.ts'),
    },
  },
})
