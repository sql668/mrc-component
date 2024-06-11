/* eslint-disable no-loop-func */
import { warning } from '@meng-rc/util';

//import type { BasicDataNode, DataNode } from 'antd/es/tree';

import type {
  BasicDataNode,
  DataEntity,
  DataNode,
  GetCheckDisabled,
  KeyEntities,
  SafeKey,
} from './type';
import getEntity from './util';

interface ConductReturnType {
  checkedKeys: SafeKey[];
  halfCheckedKeys: SafeKey[];
  expandedKeys: SafeKey[];
}

export function isCheckDisabled<TreeDataType>(node: TreeDataType) {
  const { disabled, disableCheckbox, checkable } = (node || {}) as DataNode;
  return !!(disabled || disableCheckbox) || checkable === false;
}

function removeFromCheckedKeys(halfCheckedKeys: Set<SafeKey>, checkedKeys: Set<SafeKey>) {
  const filteredKeys = new Set<SafeKey>();
  halfCheckedKeys.forEach((key) => {
    if (!checkedKeys.has(key)) {
      filteredKeys.add(key);
    }
  });
  return filteredKeys;
}

// Fill miss keys
function fillConductCheck<TreeDataType extends BasicDataNode = DataNode>(
  keys: Set<SafeKey>,
  levelEntities: Map<number, Set<DataEntity<TreeDataType>>>,
  maxLevel: number,
  syntheticGetCheckDisabled: GetCheckDisabled<TreeDataType>,
): ConductReturnType {
  const checkedKeys = new Set<SafeKey>(keys);
  const halfCheckedKeys = new Set<SafeKey>();
  const expandedKeys = new Set<SafeKey>();

  // 从上到下遍历，将父节点对应的子节点添加到checkedKeys中
  for (let level = 0; level <= maxLevel; level += 1) {
    const entities = levelEntities.get(level) || new Set();
    entities.forEach((entity) => {
      const { key, node, children = [] } = entity;
      if (checkedKeys.has(key) && !syntheticGetCheckDisabled(node)) {
        children
          .filter((childEntity) => !syntheticGetCheckDisabled(childEntity.node))
          .forEach((childEntity) => {
            checkedKeys.add(childEntity.key);
          });
      }
    });
  }
  // 从下到上遍历，如果子节点全部选中，则将父节点选中，否则将父节点半选中
  // visitedKeys用来记录已经访问过的父节点，避免重复访问
  const visitedKeys = new Set<SafeKey>();
  for (let level = maxLevel; level >= 0; level -= 1) {
    const entities = levelEntities.get(level) || new Set();
    entities.forEach((entity) => {
      const { parent, node } = entity;

      // Skip if no need to check
      if (syntheticGetCheckDisabled(node) || !entity.parent || visitedKeys.has(entity.parent.key)) {
        return;
      }

      // Skip if parent is disabled
      if (syntheticGetCheckDisabled(entity.parent.node)) {
        parent && visitedKeys.add(parent.key);
        return;
      }

      // 假设该节点的所有子节点处于勾选状态，则allChecked为true,partialChecked=false
      let allChecked = true; // 是否全选
      let partialChecked = false; // 是否半选
      let expand = false;

      (parent?.children || [])
        .filter((childEntity) => !syntheticGetCheckDisabled(childEntity.node))
        .forEach(({ key }) => {
          const checked = checkedKeys.has(key);
          if (allChecked && !checked) {
            // 有一个子节点没有选中，父节点就不是全选状态
            allChecked = false;
          }

          if (!partialChecked && (checked || halfCheckedKeys.has(key))) {
            partialChecked = true;
          }

          if (!expand && (checked || expandedKeys.has(key))) {
            expand = true;
          }
        });
      // 如果parent的所有子节点处于勾选状态，就把parent也勾选上
      if (allChecked) {
        parent && checkedKeys.add(parent.key);
      }
      // 如果parent的子节点中有一个处于半选状态，就把parent设置为半选状态
      if (partialChecked) {
        parent && halfCheckedKeys.add(parent.key);
      }

      if (expand) {
        parent && expandedKeys.add(parent?.key);
      }
      // 将parent添加到visitedKeys中，避免重复访问
      parent && visitedKeys.add(parent.key);
    });
  }

  return {
    checkedKeys: Array.from(checkedKeys),
    halfCheckedKeys: Array.from(removeFromCheckedKeys(halfCheckedKeys, checkedKeys)),
    expandedKeys: Array.from(expandedKeys),
  };
}

// Remove useless key
function cleanConductCheck<TreeDataType extends BasicDataNode = DataNode>(
  keys: Set<SafeKey>,
  halfKeys: SafeKey[],
  levelEntities: Map<number, Set<DataEntity<TreeDataType>>>,
  maxLevel: number,
  syntheticGetCheckDisabled: GetCheckDisabled<TreeDataType>,
): ConductReturnType {
  const checkedKeys = new Set<SafeKey>(keys);
  let halfCheckedKeys = new Set<SafeKey>(halfKeys);

  // Remove checked keys from top to bottom
  for (let level = 0; level <= maxLevel; level += 1) {
    const entities = levelEntities.get(level) || new Set();
    entities.forEach((entity) => {
      const { key, node, children = [] } = entity;
      if (!checkedKeys.has(key) && !halfCheckedKeys.has(key) && !syntheticGetCheckDisabled(node)) {
        children
          .filter((childEntity) => !syntheticGetCheckDisabled(childEntity.node))
          .forEach((childEntity) => {
            checkedKeys.delete(childEntity.key);
          });
      }
    });
  }

  // Remove checked keys form bottom to top
  halfCheckedKeys = new Set<SafeKey>();
  const visitedKeys = new Set<SafeKey>();
  for (let level = maxLevel; level >= 0; level -= 1) {
    const entities = levelEntities.get(level) || new Set();

    entities.forEach((entity) => {
      const { parent, node } = entity;

      // Skip if no need to check
      if (syntheticGetCheckDisabled(node) || !entity.parent || visitedKeys.has(entity.parent.key)) {
        return;
      }

      // Skip if parent is disabled
      if (syntheticGetCheckDisabled(entity.parent.node)) {
        parent && visitedKeys.add(parent.key);
        return;
      }

      let allChecked = true;
      let partialChecked = false;

      (parent?.children || [])
        .filter((childEntity) => !syntheticGetCheckDisabled(childEntity.node))
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
        parent && checkedKeys.delete(parent.key);
      }
      if (partialChecked) {
        parent && halfCheckedKeys.add(parent.key);
      }

      parent && visitedKeys.add(parent.key);
    });
  }

  return {
    checkedKeys: Array.from(checkedKeys),
    halfCheckedKeys: Array.from(removeFromCheckedKeys(halfCheckedKeys, checkedKeys)),
    expandedKeys: [],
  };
}

// 父子节点关联 在数据回显时，根据当前的 checkedKeys 判断节点的勾选状态，自动补充全选的key和半选的key
export function conductCheck<TreeDataType extends BasicDataNode = DataNode>(
  keyList: SafeKey[],
  checked: true | { checked: false; halfCheckedKeys: SafeKey[] },
  keyEntities: KeyEntities<TreeDataType>,
  getCheckDisabled?: GetCheckDisabled<TreeDataType>,
): ConductReturnType {
  const warningMissKeys: SafeKey[] = [];

  let syntheticGetCheckDisabled: GetCheckDisabled<TreeDataType>;
  if (getCheckDisabled) {
    syntheticGetCheckDisabled = getCheckDisabled;
  } else {
    syntheticGetCheckDisabled = isCheckDisabled;
  }

  // We only handle exist keys
  const keys = new Set<SafeKey>(
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
  Object.keys(keyEntities).forEach((key) => {
    const entity = keyEntities[key];
    const { level } = entity;

    let levelSet: Set<DataEntity<TreeDataType>> | undefined = levelEntities.get(level);
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

function getExpandKey<TreeDataType extends BasicDataNode = DataNode>(
  keys: Set<SafeKey>,
  levelEntities: Map<number, Set<DataEntity<TreeDataType>>>,
  maxLevel: number,
  syntheticGetCheckDisabled: GetCheckDisabled<TreeDataType>,
): SafeKey[] {
  const checkedKeys = new Set<SafeKey>(keys);
  const expandedKeys = new Set<SafeKey>();

  // 从下到上遍历，如果子节点全部选中，则将父节点选中，否则将父节点半选中
  // visitedKeys用来记录已经访问过的父节点，避免重复访问
  const visitedKeys = new Set<SafeKey>();
  for (let level = maxLevel; level >= 0; level -= 1) {
    const entities = levelEntities.get(level) || new Set();
    entities.forEach((entity) => {
      const { parent, node } = entity;

      // Skip if no need to check
      if (syntheticGetCheckDisabled(node) || !entity.parent || visitedKeys.has(entity.parent.key)) {
        return;
      }

      // Skip if parent is disabled
      if (syntheticGetCheckDisabled(entity.parent.node)) {
        parent && visitedKeys.add(parent.key);
        return;
      }

      let expand = false;

      (parent?.children || [])
        .filter((childEntity) => !syntheticGetCheckDisabled(childEntity.node))
        .forEach(({ key }) => {
          const checked = checkedKeys.has(key);
          if (!expand && (checked || expandedKeys.has(key))) {
            expand = true;
          }
        });

      if (expand) {
        parent && expandedKeys.add(parent?.key);
      }
      // 将parent添加到visitedKeys中，避免重复访问
      parent && visitedKeys.add(parent.key);
    });
  }

  return Array.from(expandedKeys);
}

export function getExpandKeysFromCheck<TreeDataType extends BasicDataNode = DataNode>(
  keyList: SafeKey[],
  keyEntities: KeyEntities<TreeDataType>,
  getCheckDisabled?: GetCheckDisabled<TreeDataType>,
) {
  const warningMissKeys: SafeKey[] = [];

  let syntheticGetCheckDisabled: GetCheckDisabled<TreeDataType>;
  if (getCheckDisabled) {
    syntheticGetCheckDisabled = getCheckDisabled;
  } else {
    syntheticGetCheckDisabled = isCheckDisabled;
  }

  // We only handle exist keys
  const keys = new Set<SafeKey>(
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
  Object.keys(keyEntities).forEach((key) => {
    const entity = keyEntities[key];
    const { level } = entity;

    let levelSet: Set<DataEntity<TreeDataType>> | undefined = levelEntities.get(level);
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

  return getExpandKey<TreeDataType>(keys, levelEntities, maxLevel, syntheticGetCheckDisabled);
}
