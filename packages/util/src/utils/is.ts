export const isUndefined = (val: any): val is undefined => val === undefined;
export const isBoolean = (val: any): val is boolean => typeof val === 'boolean';
export const isNumber = (val: any): val is number => typeof val === 'number';

export const isPromiseLike = (val: any) :val is PromiseLike<any> => { 
  return val !== null && ((typeof val === "object" || typeof val === "function") && typeof val.then === "function")
}


/** 是否是原始值 */
export const isPrimitive = (value:any) => {
  // return value !== Object(value) 也可以使用这种方法
  return value === null || (typeof value !== 'object' && typeof value !== 'function');
}
/** 按内容比较是否相等，不按地址比较 */
export const isEqual = (obj1:any,obj2:any) => {
  if(isPrimitive(obj1) || isPrimitive(obj2)){
    return Object.is(obj1,obj2)
  }

  if(Object.keys(obj1).length !== Object.keys(obj2).length){
    return false
  }

  for (let key in obj1) {
    if (!obj2.hasOwnProperty(key)) {
      return false;
    }
    if(!isEqual(obj1[key],obj2[key])){
        return false
    }
  }
  return true;
}
