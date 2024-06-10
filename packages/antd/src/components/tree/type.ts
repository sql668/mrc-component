import type { TreeProps as ATreeProps, TreeNodeProps } from 'antd';
import type { BasicDataNode, DataNode, EventDataNode } from 'antd/es/tree';





export type TreeDataProp = ATreeProps['treeData']
export type fieldNamesProp = ATreeProps['fieldNames'];



export type NodeElement = React.ReactElement<TreeNodeProps> & {
  selectHandle?: HTMLSpanElement;
  type: {
    isTreeNode: boolean;
  };
};

export interface Entity {
  node: NodeElement;
  index: number;
  key: Key;
  pos: string;
  parent?: Entity;
  children?: Entity[];
}

export interface DataEntity<TreeDataType extends BasicDataNode = DataNode>
  extends Omit<Entity, 'node' | 'parent' | 'children'> {
  node: TreeDataType;
  nodes: TreeDataType[];
  parent?: DataEntity<TreeDataType>;
  children?: DataEntity<TreeDataType>[];
  level: number;
}

export type SafeKey = Exclude<Key, bigint>;
export type KeyEntities<DateType extends BasicDataNode = any> = Record<
  SafeKey,
  DataEntity<DateType>
  >;

export type MergeFieldNamesProp = {
  title: string
  key: string
  children: string
}

export interface LabeledValueType {
  key?: React.Key;
  title?: React.ReactNode;
  /** Only works on `checkStrictly` */
  halfChecked?: boolean;
}

export type Key = string | number;
export type RawValueType = string | number;

export type SelectSource = 'option' | 'selection' | 'input' | 'clear';

export type DraftValueType = RawValueType | LabeledValueType | (RawValueType | LabeledValueType)[];

export interface TreeEventInfo {
  node: { key: Key };
  selected?: boolean;
  checked?: boolean;
}

export interface TreeCheckEventInfo<TreeDataType extends BasicDataNode = DataNode> {
  event: 'check';
  node: EventDataNode<TreeDataType>;
  checked: boolean;
  nativeEvent: MouseEvent;
  checkedNodes: TreeDataType[];
  checkedNodesPositions?: { node: TreeDataType; pos: string }[];
  halfCheckedKeys?: Key[];
}

export interface TreeSelectEventInfo<TreeDataType extends BasicDataNode = DataNode> {
  event: 'select';
  node: EventDataNode<TreeDataType>;
  selected: boolean;
  nativeEvent: MouseEvent;
  selectedNodes:TreeDataType[];
}


export interface MrcTreeCheckEventInfo<TreeDataType extends BasicDataNode = DataNode> {
  event: 'check';
  node: EventDataNode<TreeDataType>;
  checked: boolean;
  nativeEvent: MouseEvent;
  checkedNodes: DataEntity[];
  checkedNodesPositions?: { node: TreeDataType; pos: string }[];
  halfCheckedNodes?: DataEntity[];
}

export interface MrcTreeSelectEventInfo<TreeDataType extends BasicDataNode = DataNode> {
  event: 'select';
  node: EventDataNode<TreeDataType>;
  selected: boolean;
  nativeEvent: MouseEvent;
  selectedNodes: TreeDataType[];
}

export interface MrcTreeOnChangeEventInfo<TreeDataType extends BasicDataNode = DataNode> {
  event: 'select' | 'check';
  node: EventDataNode<TreeDataType>;
  selected: boolean;
  nativeEvent: MouseEvent;
  checkedNodes?: DataEntity[];
  halfCheckedNodes?: DataEntity[];
}

export type GetCheckDisabled<RecordType> = (record: RecordType) => boolean;
