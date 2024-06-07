import { Select } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

export function BaseLayout() {
  const nav = useNavigate()
  const handleChange = (value: string) => {
    nav(value)
  }
  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',padding:20,overflow:'hidden'}}>
      <div>
        <span>组件列表</span>
        <Select
          defaultValue="/component/sketch"
          style={{ width: 120 }}
          onChange={handleChange}
          options={[
            { value: '/component/sketch', label: 'sketch 标尺' },
            { value: '/component/tree', label: 'tree 树' },
          ]}
        />
      </div>
      <div style={{height:0,flex:1,overflow:'auto',paddingTop:20}}>
        <Outlet />
      </div>
    </div>
  )
}
