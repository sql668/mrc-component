import type { Key } from 'react';
import { warning } from '@meng-rc/util';
import type { TreeProps as ATreeProps } from 'antd';
import type { DataNode,BasicDataNode } from 'antd/es/tree';



import type { DataEntity, KeyEntities, LabeledValueType, MergeFieldNamesProp, RawValueType, SafeKey, TreeDataProp } from './type';


export function toArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  return value !== undefined ? [value] : [];
}

export function fillFieldNames(fieldNames?: ATreeProps["fieldNames"]) {
  const { title, key, children } = fieldNames || {};
  return {
    title: title || "title",
    key: key || "key",
    children: children || 'children',
  };
}

export function fillLegacyProps(dataNode: DataNode): any {
  if (!dataNode) {
    return dataNode;
  }

  const cloneNode = { ...dataNode };

  if (!('props' in cloneNode)) {
    Object.defineProperty(cloneNode, 'props', {
      get() {
        warning(
          false,
          'New `rc-tree-select` not support return node instance as argument anymore. Please consider to remove `props` access.',
        );
        return cloneNode;
      },
    });
  }

  return cloneNode;
}



/** Loop fetch all the keys exist in the tree */
export function getAllKeys(treeData: TreeDataProp, fieldNames: MergeFieldNamesProp) {
  const keys: React.Key[] = [];

  function dig(list: TreeDataProp = []) {
    list.forEach((item:any) => {
      const children = item[fieldNames.children];
      if (children) {
        keys.push(item[fieldNames.key]);
        dig(children);
      }
    });
  }

  dig(treeData);

  return keys;
}


export function isRawValue(value: RawValueType | LabeledValueType): value is RawValueType {
  return !value || typeof value !== 'object';
}


export function isNil(val: any) {
  return val === null || val === undefined;
}

export function isCheckDisabled(node: DataNode) {
  return !node || node.disabled || node.disableCheckbox || node.checkable === false;
}

// checkedkeys都没有设置halfChecked属性
export function notHasHalfCheckedProp(list: LabeledValueType[]) {
  return !list.some(item => item.halfChecked)
}

export function checkedKeysHasParent0(list: LabeledValueType[], keyEntities: Record<Key, DataEntity>) {
  if (!keyEntities) {
    return false
  }
  return list.some(item => keyEntities[item.key]?.level === 0)
  // if (Object) {

  // }
  // return true
}

export function isSingleRootTree(keyEntities: Record<Key, DataEntity>) {
  // Object.keys(keyEntities).forEach()
  let level0 = 0
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(keyEntities)) {
    if (level0 !== 0) {
      return false
    }
    if (keyEntities[key].level === 0) {
      level0++
    }
  }
  return true
}


export default function getEntity<T extends BasicDataNode = any>(keyEntities: KeyEntities<T>, key: Key) {
  return keyEntities[key as SafeKey];
}
