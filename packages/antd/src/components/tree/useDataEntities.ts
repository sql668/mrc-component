
import { convertDataToEntities } from 'rc-tree/lib/utils/treeUtil';
import type {  fieldNamesProp } from './type';
import { useMemo } from 'react';

/**
 * 将treeData转换成keyEntities
 * keyEntities 是一个对象，其中每个键都是树中节点的唯一标识符，每个值都是一个包含节点信息的对象。
 * ```
 * 节点信息包含如下信息：
 * index: 节点的索引,
 * key: 节点的唯一标识符,
 * level: 节点的层级,从 0 开始计数
 * node: 节点的原始数据,
 * chilren: 节点的子节点,
 * parent: 节点的父节点,
 * pos: 节点在父节点中的位置,
 * ```
 * @param treeData
 * @param fieldNames
 * @returns
 */
function useDataEntities(treeData: any, fieldNames: fieldNamesProp) {
  return useMemo(() => convertDataToEntities(treeData, {fieldNames}),[treeData, fieldNames])
}
export default useDataEntities;
