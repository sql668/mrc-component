import basicConfig from './rollup.config.mjs'
import { terser } from "rollup-plugin-terser"
import replace from '@rollup/plugin-replace'

const config = {
  ...basicConfig,
  output: [
    {
      name: 'MrcAntd',
      file: 'dist/index.umd.js',
      format: 'umd',
      exports: 'named',
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        '@meng-rc/util': 'MrcUtil',
        'antd': 'antd',
        'classnames': 'classNames',
      },
      plugins: [
        terser(),
      ],
    },
  ],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    ...basicConfig.plugins,
  ],
  external: ['react', 'react-dom', 'antd','@ant-design/icons','@meng-rc/util','classnames'],
}

export default config
