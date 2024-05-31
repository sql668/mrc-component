import React from 'react'
import classNames from 'classnames';

export type ButtonSize = 'lg' | 'sm'
export type ButtonType = 'primary' | 'default' | 'danger' | 'link'

// export enum ButtonSize {
//   Large = 'lg',
//   Small = 'sm'
// }

// export enum ButtonType {
//   Primary = 'primary',
//   Default = 'default',
//   Danger = 'danger',
//   Link = 'link'
// }

interface BaseButtonProps {
  className?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 按钮尺寸 */
  size?: ButtonSize;
  /** 按钮类型 */
  btnType?: ButtonType;
  /** btnType = "link" 时才会生效，跳转地址 */
  href?: string;
  children?: React.ReactNode;
}
type NativeButtonProps = BaseButtonProps & React.ButtonHTMLAttributes<HTMLElement>

type AnchorButtonProps = BaseButtonProps & React.AnchorHTMLAttributes<HTMLElement>

//partial 所有属性可选
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps> 

/**
 * 按钮常用于页面交互
 * ### 引用方法
 * ```
   import {Button} from "meng-ui-react"
  ```
 * @param props 
 * @returns 
 */
export const Button: React.FC<ButtonProps> = (props) => { 
  const {
    btnType,
    className,
    size,
    disabled,
    children,
    href,
    ...restProps
  } = props

  const classes = classNames("mx-btn",className, {
    [`btn-${btnType}`]: btnType,
    [`btn-${size}`]: size,
    'disabled': (btnType === "link") && disabled
  })

  if (btnType === "link" && href) {
    return (
      <a className={classes} href={href} {...restProps}>
        { children}
      </a>
    )
  } else {
    return (
      <button className={classes} disabled={disabled} {...restProps}>
        { children }
      </button>
    )
  }
  
}

Button.defaultProps = {
  disabled: false,
  btnType: "default",
}

export default Button
