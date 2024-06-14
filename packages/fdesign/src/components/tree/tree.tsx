import type { Key } from 'react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useLayoutUpdateEffect, useMergedState } from '@fdesign/util';
import type { TreeProps as ATreeProps } from 'antd';
import { Tree as ATree, Empty } from 'antd';
import type { EventDataNode } from 'antd/es/tree';



import { conductCheck, getExpandKeysFromCheck } from './handleKeys';
import type { DataEntity, KeyTitleType, MrcTreeCheckEventInfo, MrcTreeOnChangeEventInfo, SafeKey, SelectedKeysType, TreeCheckEventInfo, TreeSelectEventInfo } from './type';
import useCheckedKeys from './useCheckedKeys';
import useDataEntities from './useDataEntities';
import { useFilterTreeData } from './useFilterTreeData';
import useRefFunc from './useRefFunc';
import { fillFieldNames, getAllKeys, isCheckDisabled, isSimpleKeyMode, toArray } from './util';


// onCheck和onSelect事件合并为onChange
export interface TreeProps extends Omit<ATreeProps, 'filterTreeNode' | 'onCheck' | 'onSelect' | 'defaultExpandedKeys' | 'defaultExpandAll' | 'defaultCheckedKeys' | "defaultSelectedKeys" |"checkedKeys" | "selectedKeys" | "onSelect"> {
  treeData: ATreeProps['treeData'];
  /** 搜索value */
  searchValue?: string;

  /** 默认选中的的key 非受控模式 */
  defaultSelectedKeys?: SelectedKeysType;

  /** 选中的key 受控模式 */
  selectedKeys?: SelectedKeysType;

  /** 展开所有 */
  expandAll?: boolean;

  /** 如果传递了selectedKeys 是否自动展开对应的父节点 */
  autoExpand?:boolean

  /** 根据什么属性值来进行筛选，默认值为 'title' */
  treeNodeFilterProp?: string;
  filterTreeNode?: boolean | ATreeProps['filterTreeNode'];
  onSelect?: (
    checkKeys: {
      checkedKeys: Key[];
      halfCheckedKeys: Key[];
    },
    info: MrcTreeCheckEventInfo,
  ) => void;
}
const Tree = forwardRef((props: TreeProps, ref) => {
  const {
    treeData,
    multiple: treeMultiple,
    searchValue,
    treeNodeFilterProp = 'title',
    filterTreeNode = true,
    fieldNames,
    checkable: treeCheckable,
    checkStrictly: treeCheckStrictly,
    expandAll,
    autoExpand,
    expandedKeys: treeExpandedKeys,
    onExpand: onTreeExpand,
    defaultSelectedKeys: treeDefaultSelectedKeys,
    selectedKeys: treeSelextedKeys,
    onSelect,
    ...restProps
  } = props;

  // 开启 checkbox 并且 父子节点关联
  const treeConduction = treeCheckable && !treeCheckStrictly;

  // 是否显示checkbox（开启 checkbox 或者 父子节点不关联）
  const mergedCheckable = treeCheckable || treeCheckStrictly;

  // 是否为多选模式(显示checkbox 或者 multiple = true)
  const mergedMultiple = mergedCheckable || treeMultiple;

  const eventInfo = useRef<any>(null);

  const mergedFieldNames = useMemo(
    () => fillFieldNames(fieldNames),
    /* eslint-disable react-hooks/exhaustive-deps */
    [JSON.stringify(fieldNames)],
    /* eslint-enable react-hooks/exhaustive-deps */
  );

  /** 格式化selectedKeys 统一转换成(SafeKey | KeyTitleType)[] */
  const toComplexKeyMode = useCallback((draftValues: SelectedKeysType) => {
    const values = toArray(draftValues);
    return values.map((val) => {
      if (isSimpleKeyMode(val)) {
        return { key: val };
      }
      return val;
    });
  }, []);

  // searchValue 只显示匹配的节点以及父节点
  const filterTreeData = useFilterTreeData(treeData, searchValue || "", {
    fieldNames: mergedFieldNames,
    treeNodeFilterProp,
    filterTreeNode,
  });
  

  const { keyEntities } = useDataEntities(filterTreeData, mergedFieldNames);

  // 合并selectedKeys,selectedKeys优先级高于defaultSelectedKeys
  const [internalSelectedKeys, setInternalSelectedKeys] = useMergedState(
    treeDefaultSelectedKeys || [],
    { defaultValue: treeSelextedKeys },
  );

  const rawMixedKeys = useMemo(
    () => toComplexKeyMode(internalSelectedKeys as any),
    [toComplexKeyMode, internalSelectedKeys],
  );

  const [rawLabeledValues, rawHalfLabeledValues] = useMemo(() => {
    const fullCheckValues: KeyTitleType[] = [];
    const halfCheckValues: KeyTitleType[] = [];

    rawMixedKeys.forEach((item: any) => {
      if (item.halfChecked) {
        halfCheckValues.push(item);
      } else {
        fullCheckValues.push(item);
      }
    });
    return [fullCheckValues, halfCheckValues];
  }, [rawMixedKeys]);

  const [rawCheckedKeys, rawHalfCheckedKeys, rawExpandKeys] = useCheckedKeys(
    rawLabeledValues,
    rawHalfLabeledValues,
    treeConduction ?? false,
    keyEntities,
  );

  const rawKeys = useMemo(() => rawLabeledValues.map((item) => item.key), [rawLabeledValues]);

  const splitRawKeys = useCallback(
    (newRawValues: SafeKey[]) => {
      const missingRawKeys: SafeKey[] = [];
      const existRawKeys: SafeKey[] = [];
      newRawValues.forEach((val) => {
        if (keyEntities[val]) {
          existRawKeys.push(val);
        } else {
          missingRawKeys.push(val);
        }
      });

      return { missingRawKeys, existRawKeys };
    },
    [keyEntities],
  );

  // ======================= expand  =======================
  //const [expandedKeys, setExpandedKeys] = useState<Key[] | undefined>(treeDefaultExpandedKeys);
  const [expandedKeys, setExpandedKeys] = useState<Key[] | undefined>(treeExpandedKeys);
  useLayoutUpdateEffect(() => {
    if (autoExpand && !expandAll) { 
      let checkedKeys: SafeKey[] = rawLabeledValues.map(({ key }) => key);
      let sk = getExpandKeysFromCheck(checkedKeys, keyEntities);
      setExpandedKeys(sk);
    } 
  }, [treeData]);
  const [searchExpandedKeys, setSearchExpandedKeys] = useState<Key[]>();

  // 一键展开/收缩所有
  useEffect(() => {
    if (filterTreeData && filterTreeData.length > 0 && expandAll !== undefined) {
      setExpandedKeys(expandAll ? getAllKeys(filterTreeData, mergedFieldNames) : []);
    }
  }, [expandAll, filterTreeData, mergedFieldNames]);

  const mergedExpandedKeys = useMemo(() => {
    let keys = undefined;
    if (searchValue) {
      keys = searchExpandedKeys;
    } else {
      keys = expandedKeys || [];
    }
    return keys;
  }, [expandedKeys, searchExpandedKeys, searchValue]);
  useEffect(() => {
    if (searchValue) {
      setSearchExpandedKeys(getAllKeys(treeData, mergedFieldNames));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const onInternalExpand = (
    keys: Key[],
    info: {
      node: EventDataNode<any>;
      expanded: boolean;
      nativeEvent: MouseEvent;
    },
  ) => {
    setExpandedKeys(keys);
    setSearchExpandedKeys(keys);

    if (onTreeExpand) {
      onTreeExpand(keys, info);
    }
  };

  // const mergedExpandedKeys = useMemo(() => {
  //   // if (treeExpandedKeys && treeExpandedKeys.length > 0) {
  //   //   return [...treeExpandedKeys];
  //   // }
  //   // return searchValue ? searchExpandedKeys : expandedKeys;
  //   if (searchValue) {
  //     return searchExpandedKeys
  //   } else {

  //   }
  // }, [expandedKeys, searchExpandedKeys, searchValue]);

  const lowerSearchValue = String(searchValue).toLowerCase();
  const antdFilterTreeNode = (treeNode: EventDataNode<any>) => {
    if (!lowerSearchValue) {
      return false;
    }
    return String(treeNode[treeNodeFilterProp]).toLowerCase().includes(lowerSearchValue);
  };

  // ======================= check or select  =======================
  const mergedCheckedKeys: any = useMemo(() => {
    if (!mergedCheckable) {
      return null;
    }
    return {
      checked: rawCheckedKeys,
      halfChecked: rawHalfCheckedKeys,
    };
  }, [mergedCheckable, rawCheckedKeys, rawHalfCheckedKeys]);

  const treeProps: Partial<ATreeProps> = {
    fieldNames: mergedFieldNames,
  };
  if (mergedExpandedKeys) {
    treeProps.expandedKeys = mergedExpandedKeys;
  }

  const getTreeNodeByKeys = useCallback(
    (keys: SafeKey[]) => {
      const result: DataEntity[] = [];
      keys.forEach((key) => {
        if (keyEntities[key]) {
          result.push(keyEntities[key].node);
        }
      });
      return result;
    },
    [keyEntities],
  );

  useEffect(() => {
    if (eventInfo.current && onSelect) {
      onSelect(
        { checkedKeys: rawCheckedKeys, halfCheckedKeys: rawHalfCheckedKeys },
        {
          ...eventInfo.current,
          checkedNodes: getTreeNodeByKeys(rawCheckedKeys),
          halfCheckedNodes: getTreeNodeByKeys(rawHalfCheckedKeys),
        },
      );
      eventInfo.current = null;
    }
  }, [rawCheckedKeys, rawHalfCheckedKeys]);

  const getKeys = (keys: (SafeKey | KeyTitleType)[]) => {
    const result: React.Key[] = [];
    keys.forEach((item) => {
      if (isSimpleKeyMode(item)) {
        result.push(item);
      } else {
        result.push(item.key);
      }
    });
    return result;
  };

  // =========================== Change ===========================
  const triggerChange = useRefFunc((newRawValues: SafeKey[], info: any) => {
    setInternalSelectedKeys(newRawValues);
    if (onSelect) {
      eventInfo.current = info;
    }
  });

  const onTreeNodeChangeEvent = useCallback(
    (selectedKey: string | number, info: MrcTreeOnChangeEventInfo) => {
      let newRawValues = info.selected
        ? [...rawKeys, selectedKey]
        : rawCheckedKeys.filter((v) => v !== selectedKey);

      if (!mergedMultiple) {
        triggerChange([selectedKey], info);
      } else {
        let checkedKeys: React.Key[] = [];
        let halfKeys: React.Key[] = [];
        if (treeConduction) {
          // 父子节点关联
          const { missingRawKeys, existRawKeys } = splitRawKeys(newRawValues);
          const keyList = existRawKeys.map((val) => keyEntities[val].key);

          if (info.selected) {
            ({ checkedKeys, halfCheckedKeys: halfKeys } = conductCheck(keyList, true, keyEntities));
          } else {
            ({ checkedKeys, halfCheckedKeys: halfKeys } = conductCheck(
              keyList,
              { checked: false, halfCheckedKeys: rawHalfCheckedKeys },
              keyEntities,
            ));
          }
          newRawValues = [
            ...missingRawKeys,
            ...checkedKeys.map((key) => keyEntities[key as SafeKey].node[mergedFieldNames.key]),
          ];
        }
        triggerChange(newRawValues, info);
      }
    },
    [
      rawKeys,
      keyEntities,
      rawCheckedKeys,
      rawHalfCheckedKeys,
      mergedMultiple,
      treeConduction,
      triggerChange,
      splitRawKeys,
    ],
  );

  // tree node check
  const onTreeNodeCheckEvent = useCallback(
    (checkedKey: string | number, info: MrcTreeOnChangeEventInfo) => {
      let newRawValues = info.selected
        ? [...rawKeys, checkedKey]
        : rawCheckedKeys.filter((v) => v !== checkedKey);

      let checkedKeys: SafeKey[] = [];
      let halfKeys: SafeKey[] = [];

      if (treeConduction) {
        // 父子节点关联
        // Should keep missing values
        const { missingRawKeys, existRawKeys } = splitRawKeys(newRawValues);
        const keyList = existRawKeys.map((val) => keyEntities[val].key);

        if (info.selected) {
          ({ checkedKeys, halfCheckedKeys: halfKeys } = conductCheck(keyList, true, keyEntities));
        } else {
          ({ checkedKeys, halfCheckedKeys: halfKeys } = conductCheck(
            keyList,
            { checked: false, halfCheckedKeys: rawHalfCheckedKeys },
            keyEntities,
          ));
        }
        newRawValues = [
          ...missingRawKeys,
          ...checkedKeys.map((key) => keyEntities[key].node[mergedFieldNames.key]),
        ];
      }
      setInternalSelectedKeys(newRawValues);

      if (onSelect) {
        info.checkedNodes = getTreeNodeByKeys(newRawValues);
        info.halfCheckedNodes = getTreeNodeByKeys(halfKeys);
        eventInfo.current = info;
      }
    },
    [rawKeys, rawCheckedKeys,rawHalfCheckedKeys, treeConduction, splitRawKeys,keyEntities],
  );

  const onInternalCheck = (_: any, info: TreeCheckEventInfo): void => {
    const { node } = info;
    // eslint-disable-next-line no-useless-return
    if (mergedCheckable && isCheckDisabled(node)) return;
    onTreeNodeChangeEvent(node.key, {
      event: 'check',
      node: info.node,
      selected: !rawCheckedKeys.includes(node.key),
      nativeEvent: info.nativeEvent,
    });
  };

  const onInternalSelect = (keys: React.Key[], info: TreeSelectEventInfo) => {
    const { node } = info;
    // eslint-disable-next-line no-useless-return
    if (mergedCheckable && isCheckDisabled(node)) return;
    onTreeNodeChangeEvent(node.key, {
      event: 'select',
      node: info.node,
      selected: !rawCheckedKeys.includes(node.key),
      nativeEvent: info.nativeEvent,
    });
  };

  useImperativeHandle(ref, () => ({
    getCheckedKeys: () => getKeys(rawCheckedKeys),
    getHalfCheckedKeys: () => getKeys(rawHalfCheckedKeys),
    getCheckedNodes: () => getTreeNodeByKeys(rawCheckedKeys),
    getHalfCheckedNodes: () => getTreeNodeByKeys(rawHalfCheckedKeys),
  }));

  

  if (!filterTreeData || filterTreeData?.length === 0) {
    return <Empty />;
  }
  return (
    <ATree
      treeData={filterTreeData}
      checkable={mergedCheckable}
      filterTreeNode={antdFilterTreeNode}
      onExpand={onInternalExpand}
      multiple={mergedMultiple}
      checkStrictly
      checkedKeys={mergedCheckedKeys}
      onCheck={onInternalCheck as any}
      selectedKeys={!mergedCheckable ? rawCheckedKeys : []}
      onSelect={onInternalSelect as any}
      {...restProps}
      {...treeProps}
    />
  );
});

Tree.displayName = 'Tree';

if (process.env.NODE_ENV !== 'production') {
  (Tree as any).whyDidYouRender = true;
}
export { Tree };