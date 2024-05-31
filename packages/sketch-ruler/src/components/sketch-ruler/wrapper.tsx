import { useMemo, useState } from "react"
import { CanvasRuler } from "../canvas-ruler"
import type { RulerWrapperProps } from "./type"
import { SketchLine } from "./line";




export function RulerWrapper(props: RulerWrapperProps) {
  console.log("RulerWrapper props: ", props);

  const { vertical = false,width = 200,height = 200,start = 0,lines = [],scale,ratio,thick,startNumX,startNumY,endNumX,endNumY,palette,selectLength,selectStart,isShowReferLine} = props
  const [valueNum, setValueNum] = useState(0)
  const [sketchLines, setSketchLines] = useState(lines)
  const [showIndicator,setShowIndicator] = useState(false)
   const rwStyle = useMemo(() => {
      const hContainer = {
        width: `calc(100% - ${thick}px)`,
        height: `${thick! + 1}px`,
        left: `${thick}px`,
      }
      const vContainer = {
        width: `${thick && thick + 1}px`,
        height: `calc(100% - ${thick}px)`,
        top: `${thick}px`,
      }
      return vertical ? vContainer : hContainer
   }, [vertical, thick])

  const handleNewLine = (v:number) => {
    lines.push(v)
    // console.log(lines);
    setSketchLines([...sketchLines,v])

  }
  return (<div className={vertical ? 'v-container' : 'h-container'} style={rwStyle}>
    <CanvasRuler vertical={vertical} scale={scale} width={width} height={height} start={start} ratio={ratio}
      startNumX={startNumX} endNumX={endNumX} startNumY={startNumY} endNumY={endNumY} selectStart={selectStart}
      selectLength={selectLength} palette={palette}
      valueNum={valueNum} showIndicator={showIndicator} onAddLine={handleNewLine} />
    {isShowReferLine && sketchLines.map((item, index) => <SketchLine key={ index} />)}

  </div>)
}
