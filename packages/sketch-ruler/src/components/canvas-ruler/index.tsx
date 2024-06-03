import { useEffect, useRef, useState } from "react"
import { drawCavaseRuler } from "./utils"

export interface CanvasRulerProps {
  showIndicator: boolean
  valueNum: number
  scale: number
  ratio: number
  palette: Record<string, any>
  vertical: boolean
  start: number
  width: number
  height: number
  selectStart: number
  selectLength: number
  startNumX?: number
  endNumX?: number
  startNumY?: number
  endNumY?: number
  onAddLine: (value: number) => void
  updateValueNum: (value: number) => void
  updateShowIndicator: (value: boolean) => void
}

export function CanvasRuler(props: CanvasRulerProps) {
  console.log("CanvasRuler props: ",props);

  const { showIndicator, valueNum, scale, ratio:ratioProp, palette, vertical, start, width, height, selectStart, selectLength, startNumX, endNumX, startNumY, endNumY,onAddLine, updateValueNum, updateShowIndicator } = props
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null)

  const [canvasRatio,setCanvasRatio] = useState(1)

  const initCanvasRef = () => {
      setCanvasContext(canvasRef.current && canvasRef.current.getContext('2d'))
  }



  const updateCanvasContext = (ratio: number) => {
      if (canvasRef.current) {
        // 比例宽高
        canvasRef.current.width = width! * ratio!
        canvasRef.current.height =height! * ratio!
        const ctx = canvasContext
        if (ctx) {
          ctx.font = `${12 * ratio!}px -apple-system,
                "Helvetica Neue", ".SFNSText-Regular",
                "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
                "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`
          ctx.lineWidth = 1
          ctx.textBaseline = 'middle'
        }
      }
  }

  const drawRuler = (ratio: number) => {
      const options = {
        scale:scale!,
        width:width!,
        height: height!,
        palette: palette!,
        startNumX: startNumX!,
        endNumX: endNumX!,
        startNumY: startNumY!,
        endNumY: endNumY!,
        ratio,
      }

      if (canvasContext) {
        drawCavaseRuler(
          canvasContext,
          props.start!,
          props.selectStart!,
          props.selectLength!,
          options,
          !vertical,
        )
      }
  }

  useEffect(() => {
    updateCanvasContext(canvasRatio)
    drawRuler(canvasRatio)
  },[canvasContext,canvasRatio])

  useEffect(() => {
    const _ratio = ratioProp || window.devicePixelRatio || 1
    console.log(_ratio);
    setCanvasRatio(_ratio)
    initCanvasRef()
    updateCanvasContext(_ratio)
    drawRuler(_ratio)

  },[])

  useEffect(() => {
    drawRuler(canvasRatio)
   },[start])

  useEffect(() => {
    updateCanvasContext(canvasRatio)
      drawRuler(canvasRatio)
  }, [width, height])

  const clickHandle = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const getValueByOffset = (offset: number, startP: number, scaleP: number) => Math.round(startP + offset / scaleP)
    const offset = vertical ? e.nativeEvent.offsetY : e.nativeEvent.offsetX
    const value = getValueByOffset(offset, start!, scale!)
    onAddLine(value)
  }
  const mouseEnterHandle = (e: React.MouseEvent) => {
    const getValueByOffset = (offset: number, startP: number, scaleP: number) => Math.round(startP + offset / scaleP)
    const offset = vertical ? e.nativeEvent.offsetY : e.nativeEvent.offsetX
    const value = getValueByOffset(offset, start!, scale!)
    updateValueNum(value)
    updateShowIndicator(true)
  }
  const mouseLeaveHandle = () => {
    updateShowIndicator(false)
  }
  const mouseMoveHandle = (e: React.MouseEvent) => {
     const getValueByOffset = (offset: number, startP: number, scaleP: number) => Math.round(startP + offset / scaleP)
    const offset = vertical ? e.nativeEvent.offsetY : e.nativeEvent.offsetX
    const value = getValueByOffset(offset, start!, scale!)
    updateValueNum(value)
  }
  return <canvas className="canvas-ruler" ref={canvasRef} onClick={clickHandle} onMouseEnter={mouseEnterHandle} onMouseLeave={ mouseLeaveHandle} onMouseMove={mouseMoveHandle} />
}
