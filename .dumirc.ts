import path from 'path';
import { defineConfig } from 'dumi';





export default defineConfig({
  title: 'mrc-component', // 全局页面 title
  outputPath: 'docs-dist', // 输出文件夹
  resolve: {
    //docDirs: [{ type: 'doc', dir: '/docs' }],
    atomDirs: [
      // 在这里修改components的匹配路径
      { type: 'component', dir: '/packages/antd/src/components' },
      { type: 'util', dir: '/packages/util/src/' },
    ],
    codeBlockMode: 'passive',
  },
  themeConfig: {
    nav: [
      { title: '指南', link: '/guide/introduce' },
      { title: '组件', link: '/components/tree' },
    ],
  },
});