---
category: Components
group:
  title: "数据展示"
  order: 1
nav:
  path: "Tree 树型控件"
title: "Tree 树型控件"
toc: content
demo:
  cols: 2
---


## 何时使用

文件夹、组织架构、生物分类、国家地区等等，世间万物的大多数结构都是树形结构。使用 `树控件` 可以完整展现其中的层级关系，并具有展开收起选择等交互功能。


## 代码演示

<!-- prettier-ignore -->
<code src="./demo/search.tsx" description="只显示匹配的节点以及相关联的父子节点">可搜索</code>


## API
在[antd tree](https://ant-design.antgroup.com/components/tree-cn#tree-props)基础上做了部分修改
<!-- prettier-ignore -->
| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| searchValue | 搜索过滤的输入值 |  | - |  |
| treeNodeFilterProp | 根据什么属性值来进行筛选 | string | `title` |  |
| filterTreeNode | 自定义过滤函数 | `(treeNode: EventDataNode<DataNode>) => boolean` | - |  |
| selectedKeys | 选中的key | `SelectedKeysType` | - |  |
| autoExpand | 初次渲染时，是否根据`selectedKeys`自动展开相应的节点 | `boolean` | - |  |
| expandAll | 展开/收缩所有节点 | `boolean` | - |  |
| onSelect | 展开/收缩所有节点 | `(checkKeys: {checkedKeys: Key[],halfCheckedKeys: Key[]}, info: MrcTreeCheckEventInfo) => void)` | - |  |