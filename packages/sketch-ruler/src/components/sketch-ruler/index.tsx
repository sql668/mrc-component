import type { SketchRulerProps } from "src/type";
import { RulerWrapper } from "./wrapper";
import { useEffect, useMemo, useState } from "react";
import { closeEye64, eye64 } from "./cornerImg64";

// const SketchRulerPropsDefault = {
//   width: 200,
//   height: 200,
//   scale: 1,
//   thick: 16,
//   startY: 0,
//   startNumX: -Infinity,
//   endNumX: Infinity,
//   startNumY: -Infinity,
//   endNumY: Infinity,
//   shadow: { x: 0, y: 0, width: 0, height: 0 },
//   lines: {h:[],v:[]},
// }

export function SketchRuler(props: SketchRulerProps) {
  const { width = 200, height = 200, eyeIcon, closeEyeIcon, scale = 1, thick = 16, palette, startX, startY = 0,startNumX=-Infinity, endNumX=Infinity,startNumY=-Infinity,endNumY=Infinity,shadow = { x: 0, y: 0, width: 0, height: 0 }, lines = {h:[],v:[]},isShowReferLine=true,ratio,onCornerClick } = props
  const [showReferLine, setShowReferLine] = useState<boolean>(isShowReferLine)

  useEffect(() => {
    setShowReferLine(isShowReferLine)
  },[isShowReferLine])

  const paletteCpu = useMemo(() => {
    function merge(obj: { [key: string]: any }, o: { [key: string]: any }) {
        Object.keys(obj).forEach((key) => {
          if (key && Object.prototype.hasOwnProperty.call(obj, key)) {
            if (typeof o[key] === 'object') {
              obj[key] = merge(obj[key], o[key])
            } else if (Object.prototype.hasOwnProperty.call(o, key)) {
              obj[key] = o[key]
            }
          }
        })
        return obj
      }
    const finalObj = merge(
        {
          bgColor: 'rgba(225,225,225, 0)', // ruler bg color
          longfgColor: '#BABBBC', // ruler longer mark color
          shortfgColor: '#C8CDD0', // ruler shorter mark color
          fontColor: '#7D8694', // ruler font color
          shadowColor: '#E8E8E8', // ruler shadow color
          lineColor: '#EB5648',
          borderColor: '#DADADC',
          cornerActiveColor: 'rgb(235, 86, 72, 0.6)',
          menu: {
            bgColor: '#fff',
            dividerColor: '#DBDBDB',
            listItem: {
              textColor: '#415058',
              hoverTextColor: '#298DF8',
              disabledTextColor: 'rgba(65, 80, 88, 0.4)',
              bgColor: '#fff',
              hoverBgColor: '#F2F2F2',
            },
          },
        },
      palette || {},
      )
    return finalObj
  }, [palette])

  const cornerStyle = useMemo(() => ({
        backgroundImage: showReferLine
          ? `url(${eyeIcon || eye64})`
      : `url(${closeEyeIcon || closeEye64})`,
    backgroundSize:'100% 100%',
        width: `${thick  }px`,
        height: `${thick  }px`,
        borderRight: `1px solid ${paletteCpu.borderColor}`,
        borderBottom: `1px solid ${paletteCpu.borderColor}`,
      }),[showReferLine,eyeIcon,closeEyeIcon,thick,paletteCpu])
  const cornerClick = (e:React.MouseEvent<HTMLAnchorElement>):void => {
    setShowReferLine(!showReferLine)
    onCornerClick?.(e)
  }
  return (
    <div id="mrc-ruler" className="style-ruler mrc-ruler">
      {/* 水平方向 */}
      <RulerWrapper vertical={false} width={width} height={thick} thick={thick} ratio={ratio} isShowReferLine={showReferLine } start={startX} lines={lines.h || []} selectStart={shadow.x} selectLength={shadow.width} scale={scale} startNumX={startNumX} endNumX={endNumX} palette={paletteCpu}/>
      {/* 竖直方向 */}
      <RulerWrapper vertical width={thick} height={height} isShowReferLine={showReferLine} thick={thick} ratio={ratio} start={startY} lines={lines.v || []} selectStart={shadow.y} selectLength={shadow.height} scale={scale} palette={paletteCpu} startNumY={startNumY} endNumY={endNumY} />
      <a className="corner" style={cornerStyle} onClick={ cornerClick} />
    </div>
  );
}
