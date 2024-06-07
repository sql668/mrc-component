import type {TreeProps as ATreeProps} from 'antd';
import { Tree as ATree, Empty} from 'antd';
import { useFilterTreeData } from './useFilterTreeData';
import type { Key} from 'react';
import { useEffect, useMemo, useState } from 'react';
import { fillFieldNames, getAllKeys } from './util';
import type { EventDataNode } from 'antd/es/tree';
import { useMergedState} from '@meng-rc/util/hooks'

export interface TreeProps extends Omit<ATreeProps,'filterTreeNode'> {
  treeData: ATreeProps['treeData']
  /** 搜索value */
  searchValue?: string

  /** 根据什么属性值来进行筛选，默认值为 'title' */
  treeNodeFilterProp?: string;
  filterTreeNode?: boolean | ATreeProps["filterTreeNode"]

  /** antd tree原生filterTreeNode */
  // antdFilterTreeNode?:ATreeProps["filterTreeNode"]
}
function Tree(props: TreeProps) {
  const {
    treeData,
    searchValue = "",
    treeNodeFilterProp = "title",
    filterTreeNode = false,
    fieldNames,
    checkable: treeCheckable,
    checkStrictly: treeCheckStrictly,
    // antdFilterTreeNode,
    defaultExpandAll:treeDefaultExpandAll,
    defaultExpandedKeys:treeDefaultExpandedKeys,
    expandedKeys: treeExpandedKeys,
    onExpand: onTreeExpand,
    defaultCheckedKeys: treeDefaultCheckedKeys,
    checkedKeys: treeCheckedKeys,
    ...restProps
  } = props;

  // checked keys
  const [internalCheckedKeys, setInternalCheckedKeys] = useMergedState(treeDefaultCheckedKeys, { value:treeCheckedKeys });



  const mergedFieldNames = useMemo(
    () => fillFieldNames(fieldNames),
    /* eslint-disable react-hooks/exhaustive-deps */
    [JSON.stringify(fieldNames)],
    /* eslint-enable react-hooks/exhaustive-deps */
  );
  // console.log("mergedFieldNames",mergedFieldNames);


  const [expandedKeys, setExpandedKeys] = useState<Key[] | undefined>(treeDefaultExpandedKeys);
  const [searchExpandedKeys, setSearchExpandedKeys] = useState<Key[]>();

  const mergedExpandedKeys = useMemo(() => {
    if (treeExpandedKeys && treeExpandedKeys.length > 0) {
      return [...treeExpandedKeys];
    }
    return searchValue ? searchExpandedKeys : expandedKeys;
  }, [expandedKeys, searchExpandedKeys, treeExpandedKeys, searchValue]);

  // console.log("mergedExpandedKeys", mergedExpandedKeys);

  useEffect(() => {
    if (searchValue) {
      setSearchExpandedKeys(getAllKeys(treeData, mergedFieldNames));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);



  const filterTreeData = useFilterTreeData(treeData,searchValue,{
    fieldNames:mergedFieldNames,
    treeNodeFilterProp,
    filterTreeNode,
  })
  // console.log("filterTreeData", filterTreeData);

   const mergedCheckable = treeCheckable || treeCheckStrictly;
  const mergedCheckedKeys = useMemo(() => {
    if (!mergedCheckable) {
      return null;
    }

    return {
      checked: checkedKeys,
      halfChecked: halfCheckedKeys,
    };
  }, [mergedCheckable, checkedKeys, halfCheckedKeys]);

  const onInternalExpand = (keys: Key[], info: {
      node: EventDataNode<any>;
      expanded: boolean;
      nativeEvent: MouseEvent;
    }) => {
    // console.log("onInternalExpand", keys, info);

    setExpandedKeys(keys);
    setSearchExpandedKeys(keys);

    if (onTreeExpand) {
      onTreeExpand(keys,info);
    }
  };

  const lowerSearchValue = String(searchValue).toLowerCase();
  const antdFilterTreeNode = (treeNode: EventDataNode<any>) => {
    debugger
    if (!lowerSearchValue) {
      return false;
    }
    console.log(treeNode,String(treeNode[treeNodeFilterProp]).toLowerCase().includes(lowerSearchValue))
    return String(treeNode[treeNodeFilterProp]).toLowerCase().includes(lowerSearchValue);
  };

  const treeProps: Partial<ATreeProps> = {
    fieldNames:mergedFieldNames,
  }
  if (mergedExpandedKeys) {
    treeProps.expandedKeys = mergedExpandedKeys;
  }
  console.log(restProps);
  console.log(treeProps);

   if (!filterTreeData || filterTreeData?.length === 0) {
    return <Empty />
   }
  return (<ATree
    treeData={filterTreeData}
    checkable={ mergedCheckable}
    filterTreeNode={antdFilterTreeNode}
    defaultExpandAll={treeDefaultExpandAll}
    onExpand={onInternalExpand}
  checkStrictly
    {...restProps}
    {...treeProps}
  />)

}

Tree.displayName = 'Tree'

Tree.whyDidYouRender = true

export { Tree }


