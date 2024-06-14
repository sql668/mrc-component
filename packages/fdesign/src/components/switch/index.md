---
category: Components
group:
  title: "数据录入"
  order: 1
title: "Switch 开关"
toc: content
demo:
  cols: 2
---


## 组件说明

在antd switch组件的基础上添加了`beforeChange`能阻止开关状态切换

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/beforeChange.tsx" description="设置beforeChange属性，若返回 false 或者返回 Promise 且被 reject，则停止切换">阻止切换</code>