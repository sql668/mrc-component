import type { Key } from 'react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useMergedState } from '@meng-rc/util';
import type { TreeProps as ATreeProps } from 'antd';
import { Tree as ATree, Empty } from 'antd';
import type { EventDataNode } from 'antd/es/tree';



import { conductCheck } from './handleKeys';
// import useMergedState from 'rc-util/lib/hooks/useMergedState';

import type { DataEntity, DraftValueType, LabeledValueType, MrcTreeCheckEventInfo, MrcTreeOnChangeEventInfo, MrcTreeSelectEventInfo, RawValueType, SelectSource, TreeCheckEventInfo, TreeEventInfo, TreeSelectEventInfo } from './type';
import useCheckedKeys from './useCheckedKeys';
import useDataEntities from './useDataEntities';
import { useFilterTreeData } from './useFilterTreeData';
import useRefFunc from './useRefFunc';
import { fillFieldNames, getAllKeys, isCheckDisabled, isRawValue, toArray } from './util';


// onCheck和onSelect事件合并为onChange
export interface TreeProps extends Omit<ATreeProps, 'filterTreeNode' | 'onCheck' | 'onSelect'> {
  treeData: ATreeProps['treeData'];
  /** 搜索value */
  searchValue?: string;

  /** 根据什么属性值来进行筛选，默认值为 'title' */
  treeNodeFilterProp?: string;
  filterTreeNode?: boolean | ATreeProps['filterTreeNode'];

  /** antd tree原生filterTreeNode */
  // antdFilterTreeNode?:ATreeProps["filterTreeNode"]

  // onCheck?: (
  //   checkKeys: {
  //     checkedKeys: Key[];
  //     halfCheckedKeys: Key[];
  //   },
  //   info: MrcTreeCheckEventInfo,
  // ) => void;

  onChange?: (
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
    searchValue = '',
    treeNodeFilterProp = 'title',
    filterTreeNode = false,
    fieldNames,
    checkable: treeCheckable,
    checkStrictly: treeCheckStrictly,
    // antdFilterTreeNode,
    defaultExpandAll: treeDefaultExpandAll,
    defaultExpandedKeys: treeDefaultExpandedKeys,
    expandedKeys: treeExpandedKeys,
    onExpand: onTreeExpand,
    defaultCheckedKeys: treeDefaultCheckedKeys, // 非受控状态 默认勾选的key
    checkedKeys: treeCheckedKeys, // 受控状态 勾选的key
    onCheck: onTreeCheck,
    onChange,
    ...restProps
  } = props;

  // 开启 checkbox 并且 父子节点关联
  const treeConduction = treeCheckable && !treeCheckStrictly;

  // 是否显示checkbox（开启 checkbox 或者 父子节点不关联）
  const mergedCheckable = treeCheckable || treeCheckStrictly;

  // 是否为多选模式(显示checkbox 或者 multiple = true)
  const mergedMultiple = mergedCheckable || treeMultiple;

  const mergedFieldNames = useMemo(
    () => fillFieldNames(fieldNames),
    /* eslint-disable react-hooks/exhaustive-deps */
    [JSON.stringify(fieldNames)],
    /* eslint-enable react-hooks/exhaustive-deps */
  );
  // console.log("mergedFieldNames",mergedFieldNames);

  // treeData
  const filterTreeData = useFilterTreeData(treeData, searchValue, {
    fieldNames: mergedFieldNames,
    treeNodeFilterProp,
    filterTreeNode,
  });
  console.log('filterTreeData', filterTreeData);

  const { keyEntities } = useDataEntities(filterTreeData, mergedFieldNames);
  console.log('keyEntities', keyEntities);
  const splitRawKeys = useCallback(
    (newRawValues: RawValueType[]) => {
      const missingRawKeys: RawValueType[] = [];
      const existRawKeys: RawValueType[] = [];
      debugger;
      console.log(keyEntities);
      // Keep missing value in the cache
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

  // ========================= Wrap Keys =========================

  /** 将key转换成对象形式，有利于判断勾选状态:勾选或半勾选 */
  const toLabeledValues = useCallback((draftValues: DraftValueType) => {
    const values = toArray(draftValues);
    return values.map((val) => {
      if (isRawValue(val)) {
        return { key: val };
      }
      return val;
    });
  }, []);
  // 初始选择的keys,
  console.log('treeDefaultCheckedKeys', treeDefaultCheckedKeys);
  console.log('treeCheckedKeys', treeCheckedKeys);

  const eventInfo = useRef<any>(null);
  const [internalCheckedKeys, setInternalCheckedKeys] = useMergedState(
    treeCheckedKeys || treeDefaultCheckedKeys,
    {
      value: undefined,
      onChange: (val, preVal) => {
        console.log(val, preVal, eventInfo.current);
      },
    },
  );

  useEffect(() => {
    console.log('internalCheckedKeys', internalCheckedKeys);
  }, [internalCheckedKeys]);

  const rawMixedLabeledValues = useMemo(
    () => toLabeledValues(internalCheckedKeys as any),
    [toLabeledValues, internalCheckedKeys],
  );
  console.log('rawMixedLabeledValues', rawMixedLabeledValues);

  // 将勾选的key分为全选和半选
  const [rawLabeledValues, rawHalfLabeledValues] = useMemo(() => {
    const fullCheckValues: LabeledValueType[] = [];
    const halfCheckValues: LabeledValueType[] = [];

    rawMixedLabeledValues.forEach((item: any) => {
      if (item.halfChecked) {
        halfCheckValues.push(item);
      } else {
        fullCheckValues.push(item);
      }
    });
    return [fullCheckValues, halfCheckValues];
  }, [rawMixedLabeledValues]);
  console.log('rawMixedLabeledValues', rawMixedLabeledValues);

  console.log('rawLabeledValues', rawLabeledValues);
  console.log('rawHalfLabeledValues', rawHalfLabeledValues);

  const [rawCheckedKeys, rawHalfCheckedKeys] = useCheckedKeys(
    rawLabeledValues,
    rawHalfLabeledValues,
    treeConduction,
    keyEntities,
  );
  const [checkInfo, setCheckInfo] = useState();

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

  // console.log("filterTreeData", filterTreeData);

  const mergedCheckedKeys: any = useMemo(() => {
    if (!mergedCheckable) {
      return null;
    }
    return {
      checked: rawCheckedKeys,
      halfChecked: rawHalfCheckedKeys,
    };
  }, [mergedCheckable, rawCheckedKeys, rawHalfCheckedKeys]);
  console.log('mergedCheckedKeys', mergedCheckedKeys);

  const onInternalExpand = (
    keys: Key[],
    info: {
      node: EventDataNode<any>;
      expanded: boolean;
      nativeEvent: MouseEvent;
    },
  ) => {
    // console.log("onInternalExpand", keys, info);

    setExpandedKeys(keys);
    setSearchExpandedKeys(keys);

    if (onTreeExpand) {
      onTreeExpand(keys, info);
    }
  };

  const lowerSearchValue = String(searchValue).toLowerCase();
  const antdFilterTreeNode = (treeNode: EventDataNode<any>) => {
    if (!lowerSearchValue) {
      return false;
    }
    console.log(
      treeNode,
      String(treeNode[treeNodeFilterProp]).toLowerCase().includes(lowerSearchValue),
    );
    return String(treeNode[treeNodeFilterProp]).toLowerCase().includes(lowerSearchValue);
  };

  const treeProps: Partial<ATreeProps> = {
    fieldNames: mergedFieldNames,
  };
  if (mergedExpandedKeys) {
    treeProps.expandedKeys = mergedExpandedKeys;
  }
  console.log(restProps);
  console.log(treeProps);

  const convert2LabelValues = useCallback(
    (draftValues: DraftValueType) => {
      const values = toLabeledValues(draftValues);

      return values.map((item: any) => {
        const { label: rawLabel } = item;
        const { key: rawValue, halfChecked: rawHalfChecked } = item;

        let rawDisabled: boolean | undefined;

        // const entity = valueEntities.get(rawValue);

        // Fill missing label & status
        // if (entity) {
        //   rawLabel = rawLabel ?? getLabel(entity.node);
        //   rawDisabled = entity.node.disabled;
        // } else if (rawLabel === undefined) {
        //   // We try to find in current `labelInValue` value
        //   const labelInValueItem = toLabeledValues(internalValue).find(
        //     labeledItem => labeledItem.value === rawValue,
        //   );
        //   rawLabel = labelInValueItem.label;
        // }

        return {
          label: rawLabel,
          value: rawValue,
          halfChecked: rawHalfChecked,
          disabled: rawDisabled,
        };
      });
    },
    [toLabeledValues, internalCheckedKeys],
  );



  // node select
  const onTreeNodeSelect = useCallback(
    (selectedKey: string | number, { selected }: { selected: boolean }) => {
      console.log('onTreeNodeSelect', selectedKey, selected);

      const entity = keyEntities[selectedKey];
      const node: any = entity?.node;
      // const selectedKey = node?.[mergedFieldNames.key] ?? selectedKey;
      if (!mergedMultiple) {
        // 单选模式
        // Single mode always set value
        triggerChange([selectedKey], { selected: true, triggerValue: selectedKey }, 'option');
      } else {
        // 多选模式下需要再细分 父子节点是否关联的情况

        let newRawValues = selected
          ? [...internalCheckedKeys, selectedKey]
          : rawCheckedKeys.filter((v) => v !== selectedKey);

        if (treeConduction) {
          // 父子节点关联
          // Should keep missing values
          const { missingRawKeys, existRawKeys } = splitRawKeys(newRawValues);
          const keyList = existRawKeys.map((val) => keyEntities[val].key);

          let checkedKeys: React.Key[];
          let half: React.Key[];
          if (selected) {
            ({ checkedKeys, halfCheckedKeys: half } = conductCheck(keyList, true, keyEntities));
          } else {
            ({ checkedKeys, halfCheckedKeys: half } = conductCheck(
              keyList,
              { checked: false, halfCheckedKeys: rawHalfCheckedKeys },
              keyEntities,
            ));
          }
          newRawValues = [
            ...missingRawKeys,
            ...checkedKeys.map((key) => keyEntities[key].node[mergedFieldNames.key]),
          ];
          console.log(half);
          console.log(checkedKeys);
          console.log(missingRawKeys);
        }
        console.log('newRawValues', newRawValues);
        setInternalCheckedKeys(newRawValues);
        if (onTreeCheck) {
          onTreeCheck({ checkedKeys: newRawValues }, null);
        }
      }
    },
    [mergedCheckedKeys, rawCheckedKeys, splitRawKeys],
  );

  const getTreeNodeByKeys = useCallback(
    (keys: React.Key[]) => {
      console.log(keyEntities);

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
    console.log('==================');
    console.log(rawCheckedKeys, rawHalfCheckedKeys, eventInfo.current);
    if (eventInfo.current && onChange) {
      onChange(
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

  console.log('rawCheckedKeys', rawCheckedKeys);
  console.log('rawHalfCheckedKeys', rawHalfCheckedKeys);

  const getKeys = (keys: (RawValueType | LabeledValueType)[]) => {
    const result: React.Key[] = [];
    keys.forEach((item) => {
      if (isRawValue(item)) {
        result.push(item);
      } else {
        result.push(item.key);
      }
    });
    return result;
  };

  // =========================== Change ===========================
  const triggerChange = useRefFunc((newRawValues: RawValueType[], info: any) => {

    setInternalCheckedKeys(newRawValues);

    if (onChange) {
      eventInfo.current = info;
    }
  });

  const onTreeNodeChangeEvent = useCallback(
    (selectedKey: string | number, info: MrcTreeOnChangeEventInfo) => {
      debugger
      let newRawValues = info.selected
        ? [...internalCheckedKeys, selectedKey]
        : rawCheckedKeys.filter((v) => v !== selectedKey);



      if (!mergedMultiple) {
        // Single mode always set value
        triggerChange([selectedKey], info);
      } else {
        let checkedKeys: React.Key[] = [];
        let halfKeys: React.Key[] = [];
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
          console.log(halfKeys);
          console.log(checkedKeys);
          console.log(missingRawKeys);
        }
        console.log('newRawValues', newRawValues);
        // setInternalCheckedKeys(newRawValues);
        triggerChange(newRawValues, info);

        // if (onChange) {
        //   info.checkedNodes = getTreeNodeByKeys(newRawValues);
        //   info.halfCheckedNodes = getTreeNodeByKeys(halfKeys);
        //   eventInfo.current = info;
        //   // onTreeCheck({ checkedKeys: getKeys(newRawValues), halfCheckedKeys: getKeys(halfKeys) }, info);
        // }
      }


    },
    [internalCheckedKeys, keyEntities],
  );

  // tree node check
  const onTreeNodeCheckEvent = useCallback(
    (checkedKey: string | number, info: MrcTreeCheckEventInfo) => {
      const entity = keyEntities[checkedKey];
      let newRawValues = info.checked
        ? [...internalCheckedKeys, checkedKey]
        : rawCheckedKeys.filter((v) => v !== checkedKey);

      let checkedKeys: React.Key[] = [];
      let halfKeys: React.Key[] = [];

      if (treeConduction) {
        // 父子节点关联
        // Should keep missing values
        const { missingRawKeys, existRawKeys } = splitRawKeys(newRawValues);
        const keyList = existRawKeys.map((val) => keyEntities[val].key);

        if (info.checked) {
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
        console.log(halfKeys);
        console.log(checkedKeys);
        console.log(missingRawKeys);
      }
      console.log('newRawValues', newRawValues);
      setInternalCheckedKeys(newRawValues);

      if (onChange) {
        info.checkedNodes = getTreeNodeByKeys(newRawValues);
        info.halfCheckedNodes = getTreeNodeByKeys(halfKeys);
        eventInfo.current = info;
        // onTreeCheck({ checkedKeys: getKeys(newRawValues), halfCheckedKeys: getKeys(halfKeys) }, info);
      }
    },
    [internalCheckedKeys],
  );

  const onInternalCheck = (keys: React.Key[], info: TreeCheckEventInfo): void => {
    console.log(keys, info);
    const { node } = info;

    // eslint-disable-next-line no-useless-return
    if (mergedCheckable && isCheckDisabled(node)) return;
    onTreeNodeCheckEvent(node.key, {
      event: 'check',
      node: info.node,
      selected: !rawCheckedKeys.includes(node.key),
      nativeEvent: info.nativeEvent,
    });
    // onTreeNodeSelect(node.key, { selected: !rawCheckedKeys.includes(node.key) });
  };

  const onTreeNodeSelectEvent = useCallback(
    (selectedKey: string | number, info: MrcTreeSelectEventInfo) => {
      debugger
      const entity = keyEntities[selectedKey];
      let newRawValues = info.selected
        ? [...internalCheckedKeys, selectedKey]
        : rawCheckedKeys.filter((v) => v !== selectedKey);

      let checkedKeys: React.Key[] = [];
      let halfKeys: React.Key[] = [];

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
        console.log(halfKeys);
        console.log(checkedKeys);
        console.log(missingRawKeys);
      }
      console.log('newRawValues', newRawValues);
      setInternalCheckedKeys(newRawValues);

      if (onTreeCheck) {
        info.checkedNodes = getTreeNodeByKeys(newRawValues);
        info.halfCheckedNodes = getTreeNodeByKeys(halfKeys);
        eventInfo.current = info;
        // onTreeCheck({ checkedKeys: getKeys(newRawValues), halfCheckedKeys: getKeys(halfKeys) }, info);
      }
    },
    [internalCheckedKeys],
  );

  const onInternalSelect = (keys: React.Key[], info: TreeSelectEventInfo) => {
    console.log(keys, info);
    console.log(keys, info);
    const { node } = info;

    // eslint-disable-next-line no-useless-return
    if (mergedCheckable && isCheckDisabled(node)) return;
    // onTreeNodeSelectEvent(node.key, info);
    onTreeNodeChangeEvent(node.key, {
      event: "select",
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
      defaultExpandAll={treeDefaultExpandAll}
      onExpand={onInternalExpand}
      multiple={mergedMultiple}
      checkStrictly
      checkedKeys={mergedCheckedKeys}
      onCheck={onInternalCheck}
      selectedKeys={!mergedCheckable ? rawCheckedKeys : []}
    onSelect={onInternalSelect}
      {...restProps}
      {...treeProps}
    />
  );
});

Tree.displayName = 'Tree';

if (process.env.NODE_ENV !== 'production') {
  Tree.whyDidYouRender = true;
}
export { Tree };
