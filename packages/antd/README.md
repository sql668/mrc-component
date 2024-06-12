# @meng-rc/antd

基于antd5.0版本，对部分组件进行再此封装

## 说明

react版本大于16.8

## 安装

```
npm install @meng-rc/antd
```


### 组件

#### tree

基于antd的tree组件二次封装
封装内容如下：
  - searchValue 内部基于搜索值进行过滤，只显示匹配的相关节点
  - expandAll: boolean 受控模式 快捷展开/收缩所有节点
  - 将check和select合并
  - autoExpand: boolean 组件初次渲染时，如果传递了selectedKeys 是否自动展开对应的父节点