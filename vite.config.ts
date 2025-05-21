import { defineConfig } from 'vite';
import vercel from 'vite-plugin-vercel';
import react from '@vitejs/plugin-react'
import { resolve } from 'path';
 
export default defineConfig({
  root: 'packages/fika-collect-survey-editor',
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true
  },
  server: {
    port: process.env.PORT as unknown as number,
  },
  plugins: [
    vercel(),
    react()
  ],
});
