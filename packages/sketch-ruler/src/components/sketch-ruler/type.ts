import type { lineType } from "src/type"

export interface RulerWrapperProps {

  scale: number
  ratio: number
  thick: number,
  startNumX?: number,
  endNumX?: number,
  startNumY?: number,
  endNumY?: number,
  palette: Object,
  // 是否是垂直方向
  vertical?: boolean

  // 宽度
  width?: number

  // 高度
  height?: number

  start?: number

  lines: Array<number>

  selectStart:number

  selectLength: number

  isShowReferLine:boolean
}
