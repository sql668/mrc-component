'use client';

import { error } from 'console';
import * as React from 'react';
import { isBoolean, isPromiseLike, KeyCode, useMergedState, warning } from '@fdesign/util';
import classNames from 'classnames';





const sty = {
  outline:0
}

export type SwitchChangeEventHandler = (
  checked: boolean,
  event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
) => void;
export type SwitchClickEventHandler = SwitchChangeEventHandler;

interface SwitchProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange' | 'onClick'> {
  className?: string;
  prefixCls?: string;
  disabled?: boolean;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  beforeChange?: (checked:boolean) => Promise<boolean> | boolean;
  onChange?: SwitchChangeEventHandler;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onClick?: SwitchClickEventHandler;
  tabIndex?: number;
  checked?: boolean;
  defaultChecked?: boolean;
  loadingIcon?: React.ReactNode;
  style?: React.CSSProperties;
  title?: string;
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
    });

    function triggerChange(
      newChecked: boolean,
      event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
    ):Promise<boolean> | void {
      let mergedChecked = innerChecked;
      if (disabled) {
        return
      }
      mergedChecked = newChecked;
      if (!beforeChange) {
        setInnerChecked(mergedChecked);
        onChange?.(mergedChecked, event);
        return Promise.resolve(mergedChecked)
      }

      const shouldChange = beforeChange(mergedChecked);
      const isPromiseOrBool = [isPromiseLike(shouldChange), isBoolean(shouldChange)].includes(true);
      if (!isPromiseOrBool) {
        //throwError(COMPONENT_NAME, 'beforeChange must return type `Promise<boolean>` or `boolean`');
        throw error('beforeChange must return type `Promise<boolean>` or `boolean`');
      }

      if (isPromiseLike(shouldChange)) {
        shouldChange
          .then((result) => {
            if (result) {
              setInnerChecked(mergedChecked);
              onChange?.(mergedChecked, event);
              return Promise.resolve(mergedChecked)
            }
          })
          .catch((e) => {
            warning(false,`some error occurred: ${e}`);
          });
      } else if (shouldChange) {
        setInnerChecked(mergedChecked);
        onChange?.(mergedChecked, event);
        return Promise.resolve(mergedChecked)
      }
    }

    function onInternalKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
      if (e.which === KeyCode.LEFT) {
        triggerChange(false, e);
      } else if (e.which === KeyCode.RIGHT) {
        triggerChange(true, e);
      }
      onKeyDown?.(e);
    }

    function onInternalClick(e: React.MouseEvent<HTMLButtonElement>) {
      const rf = triggerChange(!innerChecked, e)
      if (rf && rf.then) {
        rf.then(ret => { 
          onClick?.(ret, e);
        })
      }
    }

    const switchClassName = classNames(prefixCls, className, {
      [`${prefixCls}-checked`]: innerChecked,
      [`${prefixCls}-disabled`]: disabled,
    });

    return (
      <button
        {...restProps}
        type="button"
        role="switch"
        aria-checked={innerChecked}
        disabled={disabled}
        className={switchClassName}
        ref={ref}
        onKeyDown={onInternalKeyDown}
        onClick={onInternalClick}
        style={sty}
      >
        {loadingIcon}
        <span className={`${prefixCls}-inner`}>
          <span className={`${prefixCls}-inner-checked`}>{checkedChildren}</span>
          <span className={`${prefixCls}-inner-unchecked`}>{unCheckedChildren}</span>
        </span>
      </button>
    );
  },
);

RcSwitch.displayName = 'RcSwitch';

export default RcSwitch;