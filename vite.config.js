// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 直接使用固定的 GitHub Pages 路径
export default defineConfig({
  plugins: [react()],
  // 替换为您的仓库名称
  base: '/shanbei-papercut-heritage/',
});