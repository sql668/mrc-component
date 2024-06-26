import * as React from 'react';
import { KeyCode, useMergedState } from '@meng-rc/util';
import classNames from 'classnames';





export type SwitchChangeEventHandler = (
  checked: boolean,
  event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
) => void
export type SwitchClickEventHandler = SwitchChangeEventHandler

interface SwitchProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange' | 'onClick'> {
  className?: string
  prefixCls?: string
  disabled?: boolean
  checkedChildren?: React.ReactNode
  unCheckedChildren?: React.ReactNode
  beforeChange?: (checked: boolean) => Promise<void>
  onChange?: SwitchChangeEventHandler
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>
  onClick?: SwitchClickEventHandler
  tabIndex?: number
  checked?: boolean
  defaultChecked?: boolean
  loadingIcon?: React.ReactNode
  style?: React.CSSProperties
  title?: string
}

const RcSwitch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      prefixCls = 'rc-switch',
      className,
      checked,
      defaultChecked,
      disabled,
      loadingIcon,
      checkedChildren,
      unCheckedChildren,
      onClick,
      onChange,
      beforeChange,
      onKeyDown,
      ...restProps
    },
    ref,
  ) => {
    const [innerChecked, setInnerChecked] = useMergedState<boolean>(false, {
      value: checked,
      defaultValue: defaultChecked,
    })

    function triggerChange(
      newChecked: boolean,
      event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
    ) {
      let mergedChecked = innerChecked

      if (!disabled) {
        mergedChecked = newChecked
        if (!beforeChange) {
          setInnerChecked(mergedChecked)
          onChange?.(mergedChecked, event)
        } else {
          const before = beforeChange(mergedChecked)
          if (before && before.then) {
            before.then(() => {
              setInnerChecked(mergedChecked)
              onChange?.(mergedChecked, event)
            })
          } else {
            setInnerChecked(mergedChecked)
            onChange?.(mergedChecked, event)
          }
        }

      }

      return mergedChecked
    }

    function onInternalKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
      if (e.which === KeyCode.LEFT) {
        triggerChange(false, e)
      } else if (e.which === KeyCode.RIGHT) {
        triggerChange(true, e)
      }
      onKeyDown?.(e)
    }

    function onInternalClick(e: React.MouseEvent<HTMLButtonElement>) {
      const ret = triggerChange(!innerChecked, e)
      // [Legacy] trigger onClick with value
      onClick?.(ret, e)
    }

    const switchClassName = classNames(prefixCls, className, {
      [`${prefixCls}-checked`]: innerChecked,
      [`${prefixCls}-disabled`]: disabled,
    })

    return (
      <button
        {...restProps}
        type='button'
        role='switch'
        aria-checked={innerChecked}
        disabled={disabled}
        className={switchClassName}
        ref={ref}
        onKeyDown={onInternalKeyDown}
        onClick={onInternalClick}>
        {loadingIcon}
        <span className={`${prefixCls}-inner`}>
          <span className={`${prefixCls}-inner-checked`}>{checkedChildren}</span>
          <span className={`${prefixCls}-inner-unchecked`}>{unCheckedChildren}</span>
        </span>
      </button>
    )
  },
)

RcSwitch.displayName = 'RcSwitch'

export default RcSwitch
