/* eslint-disable no-bitwise */
/* eslint-disable no-nested-ternary */
import {  useMemo, useState } from "react";
import style from "./line.module.scss"

export interface SketchLineProps {
  scale: number;
  thick: number;
  palette: Record<string, any>
  index: number;
  start: number;
  vertical: boolean;
  value: number;
  isShowReferLine: boolean;
  onMouseDown?: (e: any) => void;
  onRelease?: (value: number, index: number) => void;
  onRemove?: (index: number) => void;
}



export function SketchLine(props: SketchLineProps) {
  const { value,start,scale,vertical,palette,isShowReferLine,thick,index,onMouseDown,onRelease,onRemove } = props
  const [startValue,setStartValue] = useState(value >> 0)
  const [showLine, setShowLine] = useState<boolean>(true)

  // useEffect(() => {
  //   setStartValue(value >> 0)
  //  },[])

  const offset = useMemo(() => {
    const _offset = (startValue - start!) * scale!
    setShowLine(_offset >= 0)
    const positionValue = `${_offset}px`
      const position = vertical ? { top: positionValue } : { left: positionValue }
      return position
  }, [startValue, start, scale, vertical])

  const borderCursor = useMemo(() => {
      const borderValue = `1px solid ${palette?.lineColor}`
      const border = vertical ? { borderTop: borderValue } : { borderLeft: borderValue }
      const cursorValue = isShowReferLine
        ? vertical
          ? 'ns-resize'
          : 'ew-resize'
        : 'none'
      return {
        cursor: cursorValue,
        ...border,
      }
  }, [palette, vertical, isShowReferLine])

   const actionStyle = useMemo(() => {
      const _actionStyle = vertical
        ? { left: `${thick}px` }
        : { top: `${thick}px` }
      return _actionStyle
   }, [vertical, thick])

  const mouseDownHandle = (e:React.MouseEvent<HTMLDivElement>) => {
    const startD = vertical ? e.clientY : e.clientX
      const initValue = startValue
    onMouseDown && onMouseDown(e)

    // 移动标尺线
      const onMove = (evt: MouseEvent) => {
        const currentD = vertical ? evt.clientY : evt.clientX
        const newValue = Math.round(initValue + (currentD - startD) / scale!)
        // startValue.value = newValue
        setStartValue(newValue)
      }
      const onEnd = () => {
        // emit('onRelease', startValue.value, props.index)
        onRelease && onRelease(startValue,index)
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onEnd)
      }
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onEnd)
  }

  if (showLine) {
    return (<div className={ `${style.line} line` } style={{ ...offset, ...borderCursor }} onMouseDown={mouseDownHandle}>
      <div className={ `${style.action} action`} style={ actionStyle}>
        <span className={ `${style.del} del`} onClick={() => onRemove && onRemove(index)}>&times;</span>
        <span className={ `${style.value} value`}>{ startValue}</span>
      </div>
    </div>)
  }
  return null
}
