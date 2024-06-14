---
category: Components
group:
  title: "数据展示"
  order: 2
title: "Tree 树型控件"
toc: content
demo:
  cols: 2
---


## 组件说明

Tree组件在antd tree组件的基础之上，封装了一些常用的方法


## 代码演示

<!-- prettier-ignore -->
<code src="./demo/search.tsx" description="只显示匹配的节点以及相关联的父子节点">可搜索</code>
<code src="./demo/expand.tsx" description="展开操作,支持一键展开所有">展开</code>
<code src="./demo/checkable.tsx" description="将select和check合并">checkable</code>


## API

### props
在[antd tree](https://ant-design.antgroup.com/components/tree-cn#tree-props)基础上做了部分修改
<!-- prettier-ignore -->
| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| searchValue | 搜索过滤的输入值 |  | - |  |
| treeNodeFilterProp | 根据什么属性值来进行筛选 | string | `title` |  |
| filterTreeNode | 自定义过滤函数 | `(treeNode: EventDataNode<DataNode>) => boolean` | - |  |
| selectedKeys | 选中的key | `SelectedKeysType` | - |  |
| autoExpand | 初次渲染时，是否根据`selectedKeys`自动展开相应的节点,级别没有`expandAll`高 | `boolean` | - |  |
| expandAll | 展开/收缩所有节点 | `boolean` | - |  |
| onSelect | 选中节点的回调函数 | `(checkKeys: {checkedKeys: Key[],halfCheckedKeys: Key[]}, info: MrcTreeCheckEventInfo) => void)` | - |  |

### method

通过绑定ref注解调用即可

| 方法名 | 说明 | 
| ---   | --- | 
| getCheckedKeys | 获取全选状态下的key | 
| getHalfCheckedKeys | 获取半选状态下的key | 
| getCheckedNodes | 获取全选状态的node节点 | 
| getHalfCheckedNodes | 获取半选状态下的Node节点 | 