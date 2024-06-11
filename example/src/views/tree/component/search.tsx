import { useEffect, useRef, useState } from "react";
import { Tree } from "@meng-rc/antd";
import { DraftValueType } from "@meng-rc/antd/components/tree/type";
import { Tree as ATree, Button, Card, Checkbox, Col, Row } from "antd";
import Search from "antd/es/input/Search";



import { TreeDemoData, TreeDemoProp } from "../data";


function SearchTreeDemo() {
  const [treeData, setTreeData] = useState<TreeDemoProp[]>()
  //const [checkedKeys, setCheckedKeys] = useState<string[]>(["1-1-1","1-1-2","1-1","1"])
  const [checkedKeys, setCheckedKeys] = useState<DraftValueType>([
    { key: '1-1-1' },
    //{ key: '1-1-2' },
    //{ key: '1-1' },
    //{ key: '1' },
    // { key: '1-2' },
    // { key: '1-2-1' },
    { key: '4-1-1-1' },
    //{ key: '4-1-1-2' },
    // { key: '4-1-2-1' },
    //{ key: '4-1-1' },
    // { key: '4-1-2' },
    // { key: '4-1' },
    // { key: '4-2' },
    // { key: '4', halfChecked: true },

  ]);
  useEffect(() => {
    setTreeData(TreeDemoData);
    // setTimeout(() => {
    //   setTreeData(TreeDemoData)
    // }, 1000);
    // setTimeout(() => {
    //   setTreeData([]);
    // }, 6000);
  }, [])

  const [searchValue, setSearchValue] = useState("")

  const checkHandle = (checkedKeys: any, info: any) => {
    console.log(checkedKeys, info);
  }

  const changeHandle = (checkedKeys, info) => {
    console.log(checkedKeys,info);
  }

  const [expandAll, setExpandAll] = useState()
  const expandAllChange = (e) => {
    setExpandAll(e.target.checked)
  }

  const mt = useRef(null)
  return <Card title="搜索树" style={{ width: "900px" }}>
    <Button onClick={() => {
      console.log(mt.current?.getCheckedNodes());

    }}>获取选中节点</Button>
    展开/收缩所有<Checkbox value={ expandAll} onChange={expandAllChange}></Checkbox>

    <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={(e) => setSearchValue(e.target.value)} />
    <Row>
      <Col span={12}>
        <Tree ref={mt} treeData={treeData} selectedKeys={checkedKeys} autoExpand checkable  onSelect={changeHandle} expandAll={expandAll} onExpand={(keys, info) => {
          console.log(keys, info);

        }} fieldNames={{ title: "menuName", key: "menuId" }} key="menuId" searchValue={searchValue} filterTreeNode={true} treeNodeFilterProp="menuName"></Tree>
      </Col>
      {/* <Col span={12}>
        {
          treeData?.length > 0 && <ATree treeData={treeData} onCheck={checkHandle} fieldNames={{ title: "menuName", key: "menuId" }} key="menuId" defaultExpandAll></ATree>
        }
      </Col> */}
    </Row>

  </Card>
}

SearchTreeDemo.displayName = "SearchTreeDemo"

export { SearchTreeDemo}