export interface SketchRulerProps {
  /** 初始化标尺的缩放 */
  scale?: number;
  /** 标尺的厚度 */
  thick?: number;
  /** 放置标尺窗口的宽度 */
  width?: number;
  /** 放置标尺窗口的高度 */
  height?: number;

  /** x轴标尺开始的坐标数值 */
  startX: number;
  /** y轴标尺开始的坐标数值 */
  startY: number;

  /** x轴标尺刻度开始的坐标数值 */
  startNumX?: number;
  /** x轴标尺刻度结束的坐标数值 */
  endNumX?: number;
  /** Y轴标尺刻度开始的坐标数值 */
  startNumY?: number;
  /** Y轴标尺刻度结束的坐标数值 */
  endNumY?: number;

  shadow?: ShadowType;

  lines?: lineType;

  palette: PaletteType;

  /** base64格式的图片 */
  eyeIcon?: string;
  closeEyeIcon?: string;
  ratio: number;
  /** 是否显示参考线 */
  isShowReferLine?: boolean;

  onCornerClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface PaletteType {
  bgColor?: string;
  longfgColor?: string;
  shortfgColor?: string;
  fontColor?: string;
  shadowColor?: string;
  lineColor?: string;
  borderColor?: string;
  cornerActiveColor?: string;
  menu?: MenuType;
}

export interface MenuType {
  bgColor?: string;
  dividerColor?: string;
  listItem?: {
    textColor?: string;
    hoverTextColor?: string;
    disabledTextColor?: string;
    bgColor?: string;
    hoverBgColor?: string;
  };
}

export interface ShadowType {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface lineType {
  h?: Array<number>;
  v?: Array<number>;
}
export interface RulerWrapperProps {
  scale: number;
  ratio: number;
  thick: number;
  startNumX?: number;
  endNumX?: number;
  startNumY?: number;
  endNumY?: number;
  palette: Record<string, any>;
  // 是否是垂直方向
  vertical?: boolean;

  // 宽度
  width?: number;

  // 高度
  height?: number;

  start?: number;

  lines: Array<number>;

  selectStart: number;

  selectLength: number;

  /** 是否显示参考线 */
  isShowReferLine: boolean;
}
