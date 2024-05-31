import { useEffect, useMemo, useRef, useState } from 'react';
import style from './index.module.scss';
import { SketchRuler } from '@meng-rc/sketch-ruler'
console.log(style);

const rectWidth = 600
const rectHeight = 320

const shadow = {
  x: 0,
    y: 0,
    width: rectWidth,
    height: rectHeight
}

export function UserRuler() {

  const [state, setState] = useState({
     scale: 0.75, //658813476562495, //1,
      startX: 0,
      startY: 0,
      lines: {
        h: [433, 588],
        v: [33, 143]
      },
      thick: 20,
      isShowRuler: true, // 显示标尺
      isShowReferLine: false // 显示参考线
  })
  const cornerClick = () => {
    console.log('cornerClick');
  }
  const showLineClick = () => {
    //setShowLine(!showLine)
    setState({
      ...state,
      isShowReferLine: !state.isShowReferLine
    })
  }
  // const [scale, setScale] = useState(0.75)
  // const [showLine, setShowLine] = useState(false)

  const screensRef = useRef(null)
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  const canvasStyle = useMemo(() => {
  return {
    width: rectWidth,
    height: rectHeight,
    transform: `scale(${state.scale})`
  }
  }, [state.scale])

  useEffect(() => {
    console.log(screensRef.current);
    const screens: HTMLDivElement = screensRef.current!
    const container: HTMLDivElement = containerRef.current!
    // 滚动居中
    screens.scrollLeft = container.getBoundingClientRect().width / 2
  }, [])



  const handleScroll = () => {
    const screens: HTMLDivElement = screensRef.current!
    const canvas: HTMLDivElement = canvasRef.current!
    const screensRect = screens.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()

    // 标尺开始的刻度
    const startX = (screensRect.left + state.thick - canvasRect.left) / state.scale
    const startY = (screensRect.top + state.thick - canvasRect.top) / state.scale
    //state.startX = startX
    //state.startY = startY
    setState({
      ...state,
      startX: startX,
      startY: startY
    })
  }

  useEffect(handleScroll,[state.scale])

  const wheelHandle = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const nextScale = parseFloat(Math.max(0.2, state.scale - e.deltaY / 500).toFixed(2))
      //setScale(nextScale)
      setState({
        ...state,
        scale: nextScale
      })
    }
  }
  const scrollHandle = () => {

  }
  return (
    <>
      <div className={style.top}>缩放比例:{ state.scale  }</div>
      <button className={ style.right} onClick={showLineClick}>辅助线开关</button>
    <div className={ style.wrapper}>
      <SketchRuler width={580} height={580} scale={state.scale} thick={state.thick} startX={state.startX} startY={state.startY} shadow={shadow} startNumX={0} endNumX={600} startNumY={0} endNumY={320} isShowReferLine={ state.isShowReferLine} onCornerClick={cornerClick}></SketchRuler>
        <div  id={ style.screens}  ref={screensRef} onWheel={wheelHandle} onScroll={scrollHandle}>
          <div ref={containerRef} className={ style["screen-container"]}>
            <div id={style.canvas} style={canvasStyle} ref={ canvasRef}></div>
        </div>
      </div>
    </div>
  </>
  );
}
