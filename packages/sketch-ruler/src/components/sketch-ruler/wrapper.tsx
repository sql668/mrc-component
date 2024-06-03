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

  const indicatorStyle = useMemo(() => {
     debugger
      const indicatorOffset = (valueNum - start) * scale!
      // let positionKey = 'top'
      // let boderKey = 'borderLeft'
      const positionKey = vertical ? 'top' : 'left'
    const boderKey = vertical ? 'borderBottom' : 'borderLeft'
   const st = {
        [positionKey]: `${indicatorOffset}px`,
        [boderKey]: `1px solid ${palette?.lineColor}`,
   }
      return st
    },[valueNum,start,scale,vertical,palette?.lineColor])

  const handleNewLine = (v:number) => {
    lines.push(v)
    // console.log(lines);
    setSketchLines([...sketchLines,v])

  }
const handleLineRemove = (index: number) => {
     sketchLines.splice(index, 1)
    setSketchLines([...sketchLines])
  }
  const handleLineRelease = (value: number, index: number) => {
      // 左右或上下超出时, 删除该条对齐线
      const offset = value - start
      const maxOffset = (vertical ? height : width) / scale!
      if (offset < 0 || offset > maxOffset) {
        handleLineRemove(index)
      } else {
        props.lines[index] = value
      }
    }


  return (<div className={vertical ? 'v-container' : 'h-container'} style={rwStyle}>
    <CanvasRuler vertical={vertical} scale={scale} width={width} height={height} start={start} ratio={ratio}
      startNumX={startNumX} endNumX={endNumX} startNumY={startNumY} endNumY={endNumY} selectStart={selectStart}
      selectLength={selectLength} palette={palette}
      valueNum={valueNum} showIndicator={showIndicator} onAddLine={handleNewLine} updateValueNum={(val) => { setValueNum(val)}} updateShowIndicator={ setShowIndicator} />
    {isShowReferLine && <div className="lines" >
      {sketchLines.map((item, index) => <SketchLine key={item + index} value={item} index={index} scale={scale} start={start} thick={thick} palette={palette} vertical={vertical} isShowReferLine={ isShowReferLine} onRemove={handleLineRemove} onRelease={handleLineRelease}/>)}
    </div>}
    {showIndicator && <div className="indicator" style={ indicatorStyle}> <div className="value">{ valueNum}</div></div>}

  </div>)
}
