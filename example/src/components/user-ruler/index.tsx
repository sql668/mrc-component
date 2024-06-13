import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SketchRuler } from '@fdesign/sketch-ruler';



import style from './index.module.scss';


const rectWidth = 600
const rectHeight = 320

const shadow = {
  x: 0,
    y: 0,
    width: rectWidth,
    height: rectHeight
}

export function UserRuler() {

  const [store, setStore] = useState({
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
    setStore({
      ...store,
      isShowReferLine: !store.isShowReferLine
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
    transform: `scale(${store.scale})`
  }
  }, [store.scale])

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
    const startX = (screensRect.left + store.thick - canvasRect.left) / store.scale
    const startY = (screensRect.top + store.thick - canvasRect.top) / store.scale
    //state.startX = startX
    //state.startY = startY
    setStore({
      ...store,
      startX: startX,
      startY: startY
    })
  }

  useEffect(() => {
    handleScroll()
  },[store.scale])

  const wheelHandle = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()  //touchstart、touchmove、wheel 调用preventDefault不生效
      console.log(store.scale,e.deltaY);

      const nextScale = parseFloat(Math.max(0.2, store.scale - e.deltaY / 500).toFixed(2))
      console.log(nextScale);

      //setScale(nextScale)
      setStore({
        ...store,
        scale: nextScale
      })
      return false
    }
  }, [store])

  useEffect(() => {
    const screens: HTMLDivElement = screensRef.current!
    screens?.addEventListener("wheel", wheelHandle);
    return () => {
      screens?.removeEventListener("wheel", wheelHandle);
    };
   },[store.scale])

  return (
    <>
      <div className={style.top}>缩放比例:{ store.scale  }</div>
      <button className={ style.right} onClick={showLineClick}>辅助线开关</button>
    <div className={ style.wrapper}>
        <SketchRuler width={580} height={580} scale={store.scale} thick={store.thick} startX={store.startX} startY={store.startY} shadow={shadow} startNumX={0} endNumX={600} startNumY={0} endNumY={320} isShowReferLine={store.isShowReferLine} onCornerClick={cornerClick} lines={{
    h: [0],
    v: [0]
  } }></SketchRuler>
        <div  id={ style.screens}  ref={screensRef}  onScroll={handleScroll}>
          <div ref={containerRef} className={ style["screen-container"]}>
            <div id={style.canvas} style={canvasStyle} ref={ canvasRef}></div>
        </div>
      </div>
    </div>
  </>
  );
}