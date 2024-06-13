import type {TreeProps as ATreeProps} from 'antd';
import { useMemo } from 'react';
import type { TreeDataProp } from './type';
import { fillLegacyProps } from './util';

type GetFuncType<T> = T extends boolean ? never : T;
type FilterFn = GetFuncType<ATreeProps['filterTreeNode']>;

export function useFilterTreeData(
  treeData: TreeDataProp,
  searchValue: string,
  {
    treeNodeFilterProp,
    filterTreeNode,
    fieldNames,
  }: {
    fieldNames: ATreeProps["fieldNames"];
    treeNodeFilterProp: string;
    filterTreeNode: boolean | ATreeProps["filterTreeNode"];
  },
) {
  // console.log(treeData,searchValue,fieldNames,treeNodeFilterProp,filterTreeNode);

  const { children: fieldChildren } = fieldNames || {children:"children"};
  return useMemo(() => {
    debugger
    if (!searchValue || filterTreeNode === false) {
      return treeData;
    }

    let filterOptionFunc: FilterFn;
    if (typeof filterTreeNode === 'function') {
      filterOptionFunc = filterTreeNode;
    } else {
      const upperStr = searchValue.toUpperCase();
      filterOptionFunc = (dataNode:any) => {
        const value = dataNode[treeNodeFilterProp];
        return String(value).toUpperCase().includes(upperStr);
      };
    }

    function dig(list:TreeDataProp = [],keepAll: boolean = false) {
      return list.reduce<TreeDataProp>((total, dataNode: any) => {
        const children = dataNode[fieldChildren!];

        const match = keepAll || filterOptionFunc?.(fillLegacyProps(dataNode));
        const childList = dig(children || [], match);

        if (match || childList?.length) {
          total?.push({
            ...dataNode,
            expanded: true,
            isLeaf: undefined,
            [fieldChildren!]: childList,
          });
        }
        return total;
      }, []);
    }
    const td = dig(treeData)
    return td
  },[treeData,searchValue,fieldChildren,filterTreeNode,treeNodeFilterProp])
}
