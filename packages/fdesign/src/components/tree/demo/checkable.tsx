import { useEffect, useState } from 'react';
import { Tree } from '@fdesign/component';
import { Checkbox } from 'antd/es';



import { TreeDemoData, TreeDemoProp } from './mock';


function CheckableDemo() {
  const [expandAll, setExpandAll] = useState();
  const [treeData, setTreeData] = useState<TreeDemoProp[]>();
  useEffect(() => {
    // 模拟加载远程数据
    setTimeout(() => {
      setTreeData(TreeDemoData);
    }, 1000);
  }, []);
  return (
    <div>
      展开/收缩所有
      <Checkbox checked={expandAll} onChange={(e) => setExpandAll(e.target.checked)}></Checkbox>
      <Tree
        treeData={treeData as any}
        fieldNames={{ title: 'menuName', key: 'menuId' }}
        expandAll={expandAll}
        checkable
        onSelect={(keys,info) => console.log(keys,info)}
        key="menuId"
      ></Tree>
    </div>
  );
}
// 一定得默认导出
export default CheckableDemo;