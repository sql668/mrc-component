import type { Key } from 'react';
import { useMemo } from 'react';
import type { DataEntity } from 'rc-tree/lib/interface';
// import { conductCheck } from 'rc-tree/lib/utils/conductUtil';



import type { LabeledValueType, RawValueType } from './type';
import { conductCheck } from './handleKeys';


export default (
  rawLabeledValues: LabeledValueType[],
  rawHalfCheckedValues: LabeledValueType[],
  treeConduction: boolean,
  keyEntities: Record<Key, DataEntity>,
) =>
  useMemo(() => {
    if (!keyEntities || Object.keys(keyEntities).length === 0){
      return [[],[]]
    }
    console.log(keyEntities);
    let checkedKeys: RawValueType[] = rawLabeledValues.map(({ key }) => key);
    let halfCheckedKeys: RawValueType[] = rawHalfCheckedValues.map(({ key }) => key);

    const missingValues = checkedKeys.filter((key) => !keyEntities[key]);

    // 开启 checkbox 并且 父子节点关联
    if (treeConduction) {
      // if (rawHalfCheckedValues.length === 0) {
      //   ({ checkedKeys, halfCheckedKeys } = conductCheck(checkedKeys, true, keyEntities));
      // } else {
      //   ({ checkedKeys, halfCheckedKeys } = conductCheck(
      //     [...checkedKeys, ...halfCheckedKeys],
      //     { checked: false, halfCheckedKeys: checkedKeys },
      //     keyEntities,
      //   ));
      // }
      ({ checkedKeys, halfCheckedKeys } = conductCheck(checkedKeys, true, keyEntities));
      // return [checkedKeys, halfCheckedKeys];
    }

    return [
      // Checked keys should fill with missing keys which should de-duplicated
      Array.from(new Set([...missingValues, ...checkedKeys])),
      // Half checked keys
      halfCheckedKeys,
    ];
  }, [rawLabeledValues, rawHalfCheckedValues, treeConduction, keyEntities]);
