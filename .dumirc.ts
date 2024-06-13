import path from 'path';
import { defineConfig } from 'dumi';


console.log(path.join(__dirname, 'packages/fdesign/src'));



export default defineConfig({
  title: 'mrc-component', // 全局页面 title
  outputPath: 'docs-dist', // 输出文件夹
  resolve: {
    //docDirs: [{ type: 'doc', dir: '/docs' }],
    atomDirs: [
      // 在这里修改components的匹配路径
      { type: 'component', dir: '/packages/fdesign/src/components' },
      { type: 'util', dir: '/packages/util/src' },
    ],
    codeBlockMode: 'passive',
  },
  mfsu:false,
  themeConfig: {
    name: 'fdesign',
    nav: [
      { title: '指南', link: '/guide/introduce' },
      { title: '组件', link: '/components/tree' },
    ],
    prefersColor: { default: 'light', switch: true },
  },
  alias: {
    antd: path.join(__dirname, 'node_modules/antd'),
    '@fdesign/component': path.join(__dirname, 'packages/fdesign/src'),
    //'@ant-design/icons$': '@ant-design/icons/lib',
  },
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
});