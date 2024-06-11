//import type { Key } from 'react';
import { warning } from '@meng-rc/util';
import type { TreeProps as ATreeProps } from 'antd';



import type { BasicDataNode, DataEntity, DataNode, FieldNames, GetKey, KeyEntities, KeyTitleType, MergeFieldNamesProp, SafeKey, TreeDataProp } from './type';


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
  const keys: SafeKey[] = [];

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


export function isSimpleKeyMode(value: SafeKey | KeyTitleType): value is SafeKey {
  return !value || typeof value !== 'object';
}


export function isNil(val: any) {
  return val === null || val === undefined;
}

export function isCheckDisabled(node: DataNode) {
  return !node || node.disabled || node.disableCheckbox || node.checkable === false;
}

// // checkedkeys都没有设置halfChecked属性
// export function notHasHalfCheckedProp(list: KeyTitleType[]) {
//   return !list.some(item => item.halfChecked)
// }

// export function checkedKeysHasParent0(list: LabeledValueType[], keyEntities: Record<Key, DataEntity>) {
//   if (!keyEntities) {
//     return false
//   }
//   return list.some(item => keyEntities[item.key]?.level === 0)
//   // if (Object) {

//   // }
//   // return true
// }

// export function isSingleRootTree(keyEntities: Record<Key, DataEntity>) {
//   // Object.keys(keyEntities).forEach()
//   let level0 = 0
//   // eslint-disable-next-line no-restricted-syntax
//   for (const key of Object.keys(keyEntities)) {
//     if (level0 !== 0) {
//       return false
//     }
//     if (keyEntities[key].level === 0) {
//       level0++
//     }
//   }
//   return true
// }


export default function getEntity<T extends BasicDataNode = any>(keyEntities: KeyEntities<T>, key: SafeKey) {
  return keyEntities[key as SafeKey];
}

export function getKey(key: SafeKey, pos: string) {
  if (key !== null && key !== undefined) {
    return key;
  }
  return pos;
}



interface Wrapper {
  posEntities: Record<string, DataEntity>;
  keyEntities: KeyEntities;
}

type ExternalGetKey = GetKey<DataNode> | string;

interface TraverseDataNodesConfig {
  childrenPropName?: string;
  externalGetKey?: ExternalGetKey;
  fieldNames?: FieldNames;
}

export function getPosition(level: string | number, index: number) {
  return `${level}-${index}`;
}

/**
 * Traverse all the data by `treeData`.
 * Please not use it out of the `rc-tree` since we may refactor this code.
 */
export function traverseDataNodes(
  dataNodes: DataNode[],
  callback: (data: {
    node: DataNode;
    index: number;
    pos: string;
    key: SafeKey;
    parentPos: string | number;
    level: number;
    nodes: DataNode[];
  }) => void,
  // To avoid too many params, let use config instead of origin param
  config?: TraverseDataNodesConfig | string,
) {
  let mergedConfig: TraverseDataNodesConfig = {};
  if (typeof config === 'object') {
    mergedConfig = config;
  } else {
    mergedConfig = { externalGetKey: config };
  }
  mergedConfig = mergedConfig || {};

  // Init config
  const { childrenPropName, externalGetKey, fieldNames } = mergedConfig;

  const { key: fieldKey, children: fieldChildren } = fillFieldNames(fieldNames);

  const mergeChildrenPropName:string = childrenPropName || fieldChildren;

  // Get keys
  let syntheticGetKey: (node: DataNode, pos?: string) => SafeKey;
  if (externalGetKey) {
    if (typeof externalGetKey === 'string') {
      syntheticGetKey = (node: DataNode) => (node as any)[externalGetKey as string];
    } else if (typeof externalGetKey === 'function') {
      syntheticGetKey = (node: DataNode) => (externalGetKey as GetKey<DataNode>)(node);
    }
  } else {
    syntheticGetKey = (node:any, pos) => getKey(node[fieldKey], pos);
  }

  // Process
  function processNode(
    node: DataNode,
    index?: number,
    parent?: { node: DataNode; pos: string; level: number },
    pathNodes?: DataNode[],
  ) {
    const children = node ? node[mergeChildrenPropName] : dataNodes;
    const pos = node ? getPosition(parent.pos, index) : '0';
    const connectNodes = node ? [...pathNodes, node] : [];

    // Process node if is not root
    if (node) {
      const key: SafeKey = syntheticGetKey(node, pos);
      const data = {
        node,
        index,
        pos,
        key,
        parentPos: parent.node ? parent.pos : null,
        level: parent.level + 1,
        nodes: connectNodes,
      };

      callback(data);
    }

    // Process children node
    if (children) {
      children.forEach((subNode, subIndex) => {
        processNode(
          subNode,
          subIndex,
          {
            node,
            pos,
            level: parent ? parent.level + 1 : -1,
          },
          connectNodes,
        );
      });
    }
  }

  processNode(null);
}


/**
 * Convert `treeData` into entity records.
 */
export function convertDataToEntities(
  dataNodes: DataNode[],
  {
    initWrapper,
    processEntity,
    onProcessFinished,
    externalGetKey,
    childrenPropName,
    fieldNames,
  }: {
    initWrapper?: (wrapper: Wrapper) => Wrapper;
    processEntity?: (entity: DataEntity, wrapper: Wrapper) => void;
    onProcessFinished?: (wrapper: Wrapper) => void;
    externalGetKey?: ExternalGetKey;
    childrenPropName?: string;
    fieldNames?: FieldNames;
  } = {},
  /** @deprecated Use `config.externalGetKey` instead */
  legacyExternalGetKey?: ExternalGetKey,
) {
  // Init config
  const mergedExternalGetKey = externalGetKey || legacyExternalGetKey;

  const posEntities = {};
  const keyEntities = {};
  let wrapper: Wrapper = {
    posEntities,
    keyEntities,
  };

  if (initWrapper) {
    wrapper = initWrapper(wrapper) || wrapper;
  }

  traverseDataNodes(
    dataNodes,
    item => {
      const { node, index, pos, key, parentPos, level, nodes } = item;
      const entity: DataEntity = { node, nodes, index, key, pos, level };

      const mergedKey = getKey(key, pos);

      posEntities[pos] = entity;
      keyEntities[mergedKey as SafeKey] = entity;

      // Fill children
      entity.parent = posEntities[parentPos];
      if (entity.parent) {
        entity.parent.children = entity.parent.children || [];
        entity.parent.children.push(entity);
      }

      if (processEntity) {
        processEntity(entity, wrapper);
      }
    },
    { externalGetKey: mergedExternalGetKey, childrenPropName, fieldNames },
  );

  if (onProcessFinished) {
    onProcessFinished(wrapper);
  }

  return wrapper;
}
