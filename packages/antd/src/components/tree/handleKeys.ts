/* eslint-disable no-loop-func */
import type { Key } from 'react';
import { warning } from '@meng-rc/util';
import type { BasicDataNode, DataNode } from 'antd/es/tree';



import type { DataEntity, GetCheckDisabled, KeyEntities } from './type';
import getEntity from './util';

;


;


;











interface ConductReturnType {
  checkedKeys: Key[];
  halfCheckedKeys: Key[];
}

export function isCheckDisabled<TreeDataType>(node: TreeDataType) {
  const { disabled, disableCheckbox, checkable } = (node || {}) as DataNode;
  return !!(disabled || disableCheckbox) || checkable === false;
}

function removeFromCheckedKeys(halfCheckedKeys: Set<Key>, checkedKeys: Set<Key>) {
  const filteredKeys = new Set<Key>();
  halfCheckedKeys.forEach((key) => {
    if (!checkedKeys.has(key)) {
      filteredKeys.add(key);
    }
  });
  return filteredKeys;
}

// Fill miss keys
function fillConductCheck<TreeDataType extends BasicDataNode = DataNode>(
  keys: Set<Key>,
  levelEntities: Map<number, Set<DataEntity<TreeDataType>>>,
  maxLevel: number,
  syntheticGetCheckDisabled: GetCheckDisabled<TreeDataType>,
): ConductReturnType {
  const checkedKeys = new Set<Key>(keys);
  const halfCheckedKeys = new Set<Key>();

  // 从上到下遍历，将父节点对应的子节点添加到checkedKeys中
  for (let level = 0; level <= maxLevel; level += 1) {
    const entities = levelEntities.get(level) || new Set();
    entities.forEach(entity => {
      const { key, node, children = [] } = entity;
      if (checkedKeys.has(key) && !syntheticGetCheckDisabled(node)) {
        children
          .filter(childEntity => !syntheticGetCheckDisabled(childEntity.node))
          .forEach(childEntity => {
            checkedKeys.add(childEntity.key);
          });
      }
    });
  }
  // 从下到上遍历，如果子节点全部选中，则将父节点选中，否则将父节点半选中
  // visitedKeys用来记录已经访问过的父节点，避免重复访问
  const visitedKeys = new Set<Key>();
  for (let level = maxLevel; level >= 0; level -= 1) {
    const entities = levelEntities.get(level) || new Set();
    entities.forEach(entity => {
      const { parent, node } = entity;

      // Skip if no need to check
      if (syntheticGetCheckDisabled(node) || !entity.parent || visitedKeys.has(entity.parent.key)) {
        return;
      }

      // Skip if parent is disabled
      if (syntheticGetCheckDisabled(entity.parent.node)) {
        visitedKeys.add(parent.key);
        return;
      }

      // 假设该节点的所有子节点处于勾选状态，则allChecked为true,partialChecked=false
      let allChecked = true; // 是否全选
      let partialChecked = false; // 是否半选

      (parent.children || [])
        .filter(childEntity => !syntheticGetCheckDisabled(childEntity.node))
        .forEach(({ key }) => {
          const checked = checkedKeys.has(key);
          if (allChecked && !checked) {
            // 有一个子节点没有选中，父节点就不是全选状态
            allChecked = false;
          }

          if (!partialChecked && (checked || halfCheckedKeys.has(key))) {
            partialChecked = true;
          }
        });
      // 如果parent的所有子节点处于勾选状态，就把parent也勾选上
      if (allChecked) {
        checkedKeys.add(parent.key);
      }
      // 如果parent的子节点中有一个处于半选状态，就把parent设置为半选状态
      if (partialChecked) {
        halfCheckedKeys.add(parent.key);
      }
      // 将parent添加到visitedKeys中，避免重复访问
      visitedKeys.add(parent.key);
    });
  }

  return {
    checkedKeys: Array.from(checkedKeys),
    halfCheckedKeys: Array.from(removeFromCheckedKeys(halfCheckedKeys, checkedKeys)),
  };
}

// Remove useless key
function cleanConductCheck<TreeDataType extends BasicDataNode = DataNode>(
  keys: Set<Key>,
  halfKeys: Key[],
  levelEntities: Map<number, Set<DataEntity<TreeDataType>>>,
  maxLevel: number,
  syntheticGetCheckDisabled: GetCheckDisabled<TreeDataType>,
): ConductReturnType {
  const checkedKeys = new Set<Key>(keys);
  let halfCheckedKeys = new Set<Key>(halfKeys);

  // Remove checked keys from top to bottom
  for (let level = 0; level <= maxLevel; level += 1) {
    const entities = levelEntities.get(level) || new Set();
    entities.forEach(entity => {
      const { key, node, children = [] } = entity;
      if (!checkedKeys.has(key) && !halfCheckedKeys.has(key) && !syntheticGetCheckDisabled(node)) {
        children
          .filter(childEntity => !syntheticGetCheckDisabled(childEntity.node))
          .forEach(childEntity => {
            checkedKeys.delete(childEntity.key);
          });
      }
    });
  }

  // Remove checked keys form bottom to top
  halfCheckedKeys = new Set<Key>();
  const visitedKeys = new Set<Key>();
  for (let level = maxLevel; level >= 0; level -= 1) {
    const entities = levelEntities.get(level) || new Set();

    entities.forEach(entity => {
      const { parent, node } = entity;

      // Skip if no need to check
      if (syntheticGetCheckDisabled(node) || !entity.parent || visitedKeys.has(entity.parent.key)) {
        return;
      }

      // Skip if parent is disabled
      if (syntheticGetCheckDisabled(entity.parent.node)) {
        visitedKeys.add(parent.key);
        return;
      }

      let allChecked = true;
      let partialChecked = false;

      (parent.children || [])
        .filter(childEntity => !syntheticGetCheckDisabled(childEntity.node))
        .forEach(({ key }) => {
          const checked = checkedKeys.has(key);
          if (allChecked && !checked) {
            allChecked = false;
          }
          if (!partialChecked && (checked || halfCheckedKeys.has(key))) {
            partialChecked = true;
          }
        });

      if (!allChecked) {
        checkedKeys.delete(parent.key);
      }
      if (partialChecked) {
        halfCheckedKeys.add(parent.key);
      }

      visitedKeys.add(parent.key);
    });
  }

  return {
    checkedKeys: Array.from(checkedKeys),
    halfCheckedKeys: Array.from(removeFromCheckedKeys(halfCheckedKeys, checkedKeys)),
  };
}

// 父子节点关联 在数据回显时，根据当前的 checkedKeys 判断节点的勾选状态，自动补充全选的key和半选的key
export function conductCheck<TreeDataType extends BasicDataNode = DataNode>(
  keyList: Key[],
  checked: true | { checked: false; halfCheckedKeys: Key[] },
  keyEntities: KeyEntities<TreeDataType>,
  getCheckDisabled?: GetCheckDisabled<TreeDataType>,
): ConductReturnType {
  const warningMissKeys: Key[] = [];

  let syntheticGetCheckDisabled: GetCheckDisabled<TreeDataType>;
  if (getCheckDisabled) {
    syntheticGetCheckDisabled = getCheckDisabled;
  } else {
    syntheticGetCheckDisabled = isCheckDisabled;
  }

  // We only handle exist keys
  const keys = new Set<Key>(
    keyList.filter((key) => {
      const hasEntity = !!getEntity(keyEntities, key);
      if (!hasEntity) {
        warningMissKeys.push(key);
      }

      return hasEntity;
    }),
  );

  const levelEntities = new Map<number, Set<DataEntity<TreeDataType>>>();
  let maxLevel = 0;

  // Convert entities by level for calculation
  Object.keys(keyEntities).forEach(key => {
    const entity = keyEntities[key];
    const { level } = entity;

    let levelSet: Set<DataEntity<TreeDataType>> = levelEntities.get(level);
    if (!levelSet) {
      levelSet = new Set();
      levelEntities.set(level, levelSet);
    }

    levelSet.add(entity);

    maxLevel = Math.max(maxLevel, level);
  });

  warning(
    !warningMissKeys.length,
    `Tree missing follow keys: ${warningMissKeys
      .slice(0, 100)
      .map((key) => `'${key}'`)
      .join(', ')}`,
  );

  let result: ConductReturnType;
  if (checked === true) {
    result = fillConductCheck<TreeDataType>(
      keys,
      levelEntities,
      maxLevel,
      syntheticGetCheckDisabled,
    );
  } else {
    result = cleanConductCheck(
      keys,
      checked.halfCheckedKeys,
      levelEntities,
      maxLevel,
      syntheticGetCheckDisabled,
    );
  }

  return result;
}
