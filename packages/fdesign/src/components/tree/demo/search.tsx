import { useEffect, useState } from 'react';
import { Tree } from '@fdesign/component';
import { Input } from 'antd/es';



import { TreeDemoData, TreeDemoProp } from './mock';


const Search = Input.Search




function SearchDemo() { 
  const [searchValue, setSearchValue] = useState('');
  const [treeData, setTreeData] = useState<TreeDemoProp[]>();
   useEffect(() => {
     setTimeout(() => {
       setTreeData(TreeDemoData)
     }, 1000);
   }, []);
  return <div>
    <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={(e) => setSearchValue(e.target.value)} />
    <Tree treeData={treeData as any} fieldNames={{ title: "menuName", key: "menuId" }} key="menuId" searchValue={searchValue} treeNodeFilterProp="menuName"></Tree>
  </div>
}
// 一定得默认导出
export default SearchDemo;