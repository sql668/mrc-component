import { defineConfig } from 'vite'
import path from 'path';
import react from '@vitejs/plugin-react'
//console.log("路径地址1:",path.resolve(__dirname, '../packages/antd/src/index.tsx'));
//console.log("路径地址2:",path.resolve(__dirname, './src/components/*'));
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port: 5174
  },
  resolve: {
    alias: {
      '@meng-rc/antd': path.resolve(__dirname, '../packages/antd/src/index.tsx'),
      '@meng-rc/sketch-ruler': path.resolve(__dirname, '../packages/sketch-ruler/src/index.tsx'),
      '@c': path.resolve(__dirname, './src/components'),
    }
  }
})
