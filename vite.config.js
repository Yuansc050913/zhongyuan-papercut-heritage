// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 检查 VERCEL_ENV 环境变量。Vercel 在部署时会自动设置这个变量。
const isVercel = process.env.VERCEL_ENV;
const repoName = 'shanbei-papercut-heritage';

export default defineConfig({
  plugins: [react()],
  base: isVercel ? '/' : `/${repoName}/`, // 如果是 Vercel，使用根路径；否则使用 /仓库名/
});