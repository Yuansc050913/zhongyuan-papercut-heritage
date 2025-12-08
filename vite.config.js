import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/shanbei-papercut-heritage/',
  build: {
    outDir: 'docs', // 👈 关键：强制输出到 docs 文件夹，而不是 dist
  }
});