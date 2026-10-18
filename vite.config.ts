import { defineConfig } from 'vite'
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  server: {
    open: true,
    port: Number(process.env.PORT) || 8000,
    watch: {
      usePolling: true
    }
  },
})