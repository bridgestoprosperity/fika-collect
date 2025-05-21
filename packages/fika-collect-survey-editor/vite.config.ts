import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import { resolve } from 'path';
 
export default defineConfig({
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true
  },
  plugins: [
    react()
  ],
});
