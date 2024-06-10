import { Button, Card, Col, Row, TreeSelect } from "antd";
import { useEffect, useState } from "react";
import { TreeDemoData, TreeDemoProp } from "../data";

function TreeSelectBasic() {
  const [treeData, setTreeData] = useState<TreeDemoProp[]>()
  const [value, setValue] = useState(['1-1-1','1-1'])
  useEffect(() => {
    setTimeout(() => {
      setTreeData(TreeDemoData)
    }, 1000);
  }, [])
  const changeHandle = (value,label,extra) =>{
    console.log(value,label,extra);
    setValue(value)
  }
  return <Card title="搜索树" style={{ width: "900px" }}>
      <Button onClick={() => console.log(value)}>获取选中节点</Button>
    <Row>
      <Col span={12}>
        {treeData?.length > 0 && <TreeSelect
          value={value}
          treeCheckStrictly
          showCheckedStrategy="SHOW_ALL"
          style={{ width: "100%" }}
          treeCheckable virtual={false}
          treeData={treeData}
          fieldNames={{ label: "menuName", value: "menuId" }}
          key="menuId"
          filterTreeNode={true}
          treeNodeFilterProp="menuName"
          treeDefaultExpandAll
        onChange={changeHandle}>
        </TreeSelect>}
      </Col>
    </Row>

  </Card>
}

export { TreeSelectBasic}
