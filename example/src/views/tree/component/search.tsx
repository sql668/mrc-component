import { useEffect, useRef, useState } from "react";
import { Tree } from "@meng-rc/antd";
import { DraftValueType } from "@meng-rc/antd/components/tree/type";
import { Tree as ATree, Button, Card, Col, Row } from "antd";
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
    //{ key: '4-1-1-1' },
    //{ key: '4-1-1-2' },
    // { key: '4-1-2-1' },
    //{ key: '4-1-1' },
    // { key: '4-1-2' },
    // { key: '4-1' },
    // { key: '4-2' },
    // { key: '4', halfChecked: true },

  ]);
  useEffect(() => {
    setTimeout(() => {
      console.log(TreeDemoData);

      setTreeData(TreeDemoData)
    }, 1000);
  }, [])

  const [searchValue, setSearchValue] = useState("")

  const checkHandle = (checkedKeys: any, info: any) => {
    console.log(checkedKeys, info);

  }

  const changeHandle = (checkedKeys, info) => {
    console.log("++++++++++++");

    console.log(checkedKeys,info);

  }

  const mt = useRef(null)
  return <Card title="搜索树" style={{ width: "900px" }}>
    <Button onClick={() => {
      console.log(mt.current?.getCheckedNodes());

    }}>获取选中节点</Button>
    <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={(e) => setSearchValue(e.target.value)} />
    <Row>
      <Col span={12}>
        <Tree ref={mt} treeData={treeData} checkedKeys={checkedKeys} onChange={changeHandle} onExpand={(keys,info) => {
          console.log(keys,info);

        }} fieldNames={{ title: "menuName", key: "menuId" }} key="menuId" searchValue={searchValue} filterTreeNode={true} treeNodeFilterProp="menuName" defaultExpandAll></Tree>
      </Col>
      <Col span={12}>
        {
          treeData?.length > 0 && <ATree treeData={treeData} onCheck={checkHandle} fieldNames={{ title: "menuName", key: "menuId" }} key="menuId" defaultExpandAll></ATree>
        }
      </Col>
    </Row>

  </Card>
}

SearchTreeDemo.displayName = "SearchTreeDemo"

export { SearchTreeDemo}
