import { Tree } from "@meng-rc/antd";
import { Button, Card, Col, Row,Tree as ATree } from "antd";
import Search from "antd/es/input/Search";
import { TreeDemoData, TreeDemoProp } from "../data";
import { useEffect, useState } from "react";

function SearchTreeDemo() {
   const [treeData, setTreeData] = useState<TreeDemoProp[]>()
  useEffect(() => {
    setTimeout(() => {
      setTreeData(TreeDemoData)
    }, 1000);
  }, [])

  const [searchValue, setSearchValue] = useState("")
  return <Card title="搜索树" style={{ width: "900px" }}>
      <Button>获取选中节点</Button>
    <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={(e) => setSearchValue(e.target.value)} />
    <Row>
      <Col span={12}>
         <Tree treeData={treeData} fieldNames={{ title: "menuName", key: "menuId" }} key="menuId" searchValue={searchValue} filterTreeNode={true} treeNodeFilterProp="menuName" defaultExpandAll></Tree>
      </Col>
      <Col span={12}>
        {
          treeData?.length > 0 && <ATree treeData={treeData} fieldNames={{ title: "menuName", key: "menuId" }} key="menuId" defaultExpandAll></ATree>
        }
      </Col>
    </Row>

  </Card>
}

SearchTreeDemo.displayName = "SearchTreeDemo"

export { SearchTreeDemo}
