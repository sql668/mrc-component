import basicConfig from './rollup.config.mjs'
import { terser } from 'rollup-plugin-terser';
import excludeDependenciesFromBundle from "rollup-plugin-exclude-dependencies-from-bundle"

const config = {
  ...basicConfig,
  output: [
    {
      file: 'dist/index.es.js',
      format: 'es',
    },
  ],
  plugins: [
    ...basicConfig.plugins,
    terser({
      compress: {
        arrows: true, // 转换成箭头函数
        collapse_vars: false, // 可能有副作用，所以关掉
        comparisons: true, // 简化表达式，如：!(a <= b) → a > b
        computed_props: true, // 计算变量转换成常量，如：{["computed"]: 1} → {computed: 1}
        drop_console: true, // 去除 console.* 函数
        drop_debugger: true,
        hoist_funs: false, // 函数提升声明
        hoist_props: false, // 常量对象属性转换成常量，如：var o={p:1, q:2}; f(o.p, o.q) → f(1, 2);
        hoist_vars: false, // var声明变量提升，关掉因为会增大输出体积
        inline: true, // 只有return语句的函数的调用变成inline调用，有以下几个级别：0(false)，1，2，3(true)
        loops: true, // 优化do, while, for循环，当条件可以静态决定的时候
        negate_iife: false, // 当返回值被丢弃的时候，取消立即调用函数表达式。
        properties: false, // 用圆点操作符替换属性访问方式，如：foo["bar"] → foo.bar
        reduce_funcs: false, // 旧选项
        reduce_vars: true, // 变量赋值和使用时常量对象转常量
        switches: true, // 除去switch的重复分支和未使用部分
        toplevel: false, // 扔掉顶级作用域中未被使用的函数和变量
        typeofs: false, // 转换typeof foo == "undefined" 为 foo === void 0，主要用于兼容IE10之前的浏览器
        booleans: true, // 简化布尔表达式，如：!!a ? b : c → a ? b : c
        if_return: true, // 优化if/return 和 if/continue
        sequences: true, // 使用逗号运算符连接连续的简单语句，可以设置为正整数，以指定将生成的最大连续逗号序列数。默认200。
        unused: true, // 扔掉未被使用的函数和变量
        conditionals: true, // 优化if语句和条件表达式
        dead_code: true, // 扔掉未被使用的代码
        evaluate: true // 尝试计算常量表达式
        // passes: 2, // compress的最大运行次数，默认是1，如果不在乎执行时间可以调高
      },
      mangle: {
        safari10: true
      }, // 对代码进行混淆
      output: {
        beautify: true,
      },
    }),
    excludeDependenciesFromBundle(),
  ],
}

export default config
