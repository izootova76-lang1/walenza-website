import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/walenza-website/',
  plugins: [react()],
  server: {
    // CMS source, uploads and build output belong to a separate server.
    watch: { ignored: ['**/admin/**'] },
    fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/admin/**'] },
  },
});
