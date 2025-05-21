import { defineConfig } from 'vite';
import vercel from 'vite-plugin-vercel';
import react from '@vitejs/plugin-react'
 
export default defineConfig({
  root: 'packages/fika-collect-survey-editor',
  server: {
    port: process.env.PORT as unknown as number,
  },
  plugins: [
    vercel(),
    react()
  ],
});
