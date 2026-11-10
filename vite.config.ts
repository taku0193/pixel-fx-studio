import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const category = id.match(/node_modules\/pixelfx\/src\/fx\/([^/]+)\//)?.[1];
          if (category) return `pixelfx-${category}`;
          if (id.includes('/pixelfx/src/core/')) return 'pixelfx-core';
        },
      },
    },
  },
});
