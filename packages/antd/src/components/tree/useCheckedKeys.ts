import type { Key } from 'react';
import { useMemo } from 'react';
import type { DataEntity } from 'rc-tree/lib/interface';
// import { conductCheck } from 'rc-tree/lib/utils/conductUtil';



import type {  KeyTitleType, SafeKey } from './type';
import { conductCheck,getExpandKeysFromCheck } from './handleKeys';


export default (
  rawLabeledValues: KeyTitleType[],
  rawHalfCheckedValues: KeyTitleType[],
  treeConduction: boolean,
  keyEntities: Record<SafeKey, DataEntity>,
) =>
  useMemo(() => {
    debugger
    if (!keyEntities || Object.keys(keyEntities).length === 0){
      return [[],[]]
    }
    console.log(keyEntities);
    let checkedKeys: SafeKey[] = rawLabeledValues.map(({ key }) => key);
    let halfCheckedKeys: SafeKey[] = rawHalfCheckedValues.map(({ key }) => key);
    let expandedKeys:Key[] = []

    const missingValues = checkedKeys.filter((key) => !keyEntities[key]);

    // 开启 checkbox 并且 父子节点关联
    if (treeConduction) {
      ({ checkedKeys, halfCheckedKeys,expandedKeys } = conductCheck(checkedKeys, true, keyEntities));
      // return [checkedKeys, halfCheckedKeys];
    } else {
      expandedKeys = getExpandKeysFromCheck(checkedKeys,keyEntities)
    }

    debugger
    console.log(expandedKeys);
    

    return [
      // Checked keys should fill with missing keys which should de-duplicated
      Array.from(new Set([...missingValues, ...checkedKeys])),
      // Half checked keys
      halfCheckedKeys,
      expandedKeys,
    ];
  }, [rawLabeledValues, rawHalfCheckedValues, treeConduction, keyEntities]);
