import path from 'path'
import { fileURLToPath } from 'url';
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import sass from 'rollup-plugin-sass'
import alias from "@rollup/plugin-alias";
import { terser } from 'rollup-plugin-terser';

const overrides = {
  compilerOptions: { declaration: true },
  exclude: ["src/**/*.test.tsx", "src/**/*.stories.tsx", "src/**/*.stories.mdx", "src/setupTests.ts"],
}

// __filename包含当前模块文件的绝对路径
const __filename = fileURLToPath(import.meta.url);
/**
 *
 */
const __dirname = path.dirname(__filename);

const pathResolve = (p) => path.resolve(__dirname, p);

const config = {
  input: 'src/index.tsx',
  plugins: [
    nodeResolve(),
    commonjs(),
    json(),
    typescript({ tsconfigOverride: overrides }),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
      output: {
        beautify: false,
      },
    }),
    sass({ output: 'dist/index.css' }),
    alias({
      resolve: [".jsx", ".js",".tsx", ".ts"], // 可选，默认情况下这只会查找 .js 文件或文件夹
      entries: {
        "@": pathResolve("src"),
        "@type": pathResolve("src/type"),
        _: __dirname,
      },
    }),

  ],
}

export default config
