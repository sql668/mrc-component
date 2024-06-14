import { useState } from 'react';
import { Switch } from '@fdesign/component';





export default function () { 
  const [loading,setLoading] = useState(false)
  const beforeChangeFun:(checked:boolean) => Promise<boolean> = (checked: boolean) => {
    setLoading(true);
    return new Promise((resolve, reject) => {  
      // 模拟请求远程接口
      setTimeout(() => {
        setLoading(false);
        // 如果阻止状态切换，用reject()
        resolve(true);
      }, 2000);
    });
  };
  return <>
    <Switch beforeChange={beforeChangeFun} loading={ loading } ></Switch>
  </>
}