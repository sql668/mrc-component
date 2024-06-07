import type { TreeProps as ATreeProps } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { warning} from '@meng-rc/util'
import type { MergeFieldNamesProp, TreeDataProp } from './type';

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
