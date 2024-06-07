import type {TreeProps as ATreeProps} from 'antd';

export type TreeDataProp = ATreeProps['treeData']
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
