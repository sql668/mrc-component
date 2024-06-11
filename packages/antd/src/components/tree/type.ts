import type { TreeProps as ATreeProps, TreeNodeProps } from 'antd';





export type TreeDataProp = ATreeProps['treeData']
export type fieldNamesProp = ATreeProps['fieldNames'];

export type Key = React.Key;
export type SafeKey = Exclude<Key, bigint>;

export type GetKey<RecordType> = (record: RecordType, index?: number) => SafeKey;

export type GetCheckDisabled<RecordType> = (record: RecordType) => boolean;

export type IconType = React.ReactNode | ((props: TreeNodeProps) => React.ReactNode);

/** For fieldNames, we provides a abstract interface */
export interface BasicDataNode {
  checkable?: boolean;
  disabled?: boolean;
  disableCheckbox?: boolean;
  icon?: IconType;
  isLeaf?: boolean;
  selectable?: boolean;
  switcherIcon?: IconType;

  /** Set style of TreeNode. This is not recommend if you don't have any force requirement */
  className?: string;
  style?: React.CSSProperties;
}

export interface FieldNames {
  title?: string;
  /** @private Internal usage for `rc-tree-select`, safe to remove if no need */
  _title?: string[];
  key?: string;
  children?: string;
}

export type FieldDataNode<T, ChildFieldName extends string = 'children'> = BasicDataNode &
  T &
  Partial<Record<ChildFieldName, FieldDataNode<T, ChildFieldName>[]>>;

export type DataNode = FieldDataNode<{
  key: SafeKey;
  title?: React.ReactNode | ((data: DataNode) => React.ReactNode);
}>;


export type EventDataNode<TreeDataType> = {
  key: Key;
  expanded: boolean;
  selected: boolean;
  checked: boolean;
  loaded: boolean;
  loading: boolean;
  halfChecked: boolean;
  dragOver: boolean;
  dragOverGapTop: boolean;
  dragOverGapBottom: boolean;
  pos: string;
  active: boolean;
} & TreeDataType &
  BasicDataNode;


export type NodeElement = React.ReactElement<TreeNodeProps> & {
  selectHandle?: HTMLSpanElement;
  type: {
    isTreeNode: boolean;
  };
};

export interface Entity {
  node: NodeElement;
  index: number;
  key: SafeKey;
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


export type KeyEntities<DateType extends BasicDataNode = any> = Record<
  SafeKey,
  DataEntity<DateType>
  >;

export type MergeFieldNamesProp = {
  title: string
  key: string
  children: string
}

export interface KeyTitleType {
  key: SafeKey;
  title?: React.ReactNode;
  /** Only works on `checkStrictly` */
  halfChecked?: boolean;
}

//export type RawValueType = string | number;

//export type SelectSource = 'option' | 'selection' | 'input' | 'clear';

export type SelectedKeysType = SafeKey | KeyTitleType | (SafeKey | KeyTitleType)[];

//export type SelectedKeysType = (SafeKey | KeyTitleType)[]

export interface TreeEventInfo {
  node: { key: SafeKey };
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