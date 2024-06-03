# @meng-rc/sketch-ruler

标尺组件，一般用于大屏设计

## 说明

react版本大于16.8

## 安装

```
npm install @meng-rc/sketch-ruler
```

## 使用

```
import { SketchRuler } from '@meng-rc/sketch-ruler'
import '@meng-rc/sketch-ruler/dist/index.css'

export default () => {
  return (
    <SketchRuler />
  )
}
```

## API

### 参数

| 属性名称     | 描述                      | 类型          | 默认值      |
| ------------ | ------------------------- | ------------- | ----------- |
| scale        | 初始化标尺的缩放          | Number        | 2           |
| thick        | 标尺的厚度                | Number        | 16          |
| width        | 放置标尺窗口的宽度        | Number        | -           |
| height       | 放置标尺窗口的高度        | Number        | -           |
| eyeIcon      | 睁眼图标                  | String        | -           |
| closeEyeIcon | 闭眼图标                  | String        | -           |
| startX       | x轴标尺开始的坐标数值     | Number        | 0           |
| startY       | y轴标尺开始的坐标数值     | Number        | 0           |
| startNumX    | x轴标尺刻度开始的坐标数值 | Number        | -Infinity   |
| endNumX      | x轴标尺刻度结束的坐标数值 | Number        | Infinity    |
| startNumY    | Y轴标尺刻度开始的坐标数值 | Number        | -Infinity   |
| endNumY      | Y轴标尺刻度结束的坐标数值 | Number        | Infinity    |
| shadow       | 阴影的参数                | Shadow        | 0           |
| lines        | 初始化水平标尺上的参考线  | object<Array> | {h:[],v:[]} |
| palette      | 标尺的样式配置参数        | Palette       | 如下        |
palette:{bgColor: 'rgba(225,225,225, 0)',longfgColor: '#BABBBC',shortfgColor: '#C8CDD0',fontColor: '#7D8694', shadowColor: '#E8E8E8',lineColor: '#EB5648', borderColor: '#DADADC',cornerActiveColor: 'rgb(235, 86, 72, 0.6)',}


### Event

| 事件名称      | 描述           | 回调参数 |
| ------------- | -------------- | -------- |
| onCornerClick | 左上角点击事件 |          |


## 引用

vue标尺组件 [vue3-sketch-ruler](https://github.com/kakajun/vue3-sketch-ruler/tree/1x)
