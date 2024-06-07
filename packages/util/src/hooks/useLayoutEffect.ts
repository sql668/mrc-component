
import React, { useEffect } from 'react';
import canUseDom from '../dom/canUseDom';

/**
 * Wrap `React.useLayoutEffect` which will not throw warning message in test env
 */
const useInternalLayoutEffect =
  process.env.NODE_ENV !== 'test' && canUseDom()
    ? React.useLayoutEffect
    : useEffect;

const useLayoutEffect = (
  callback: (mount: boolean) => void | VoidFunction,
  deps?: React.DependencyList,
) => {
  const firstMountRef = React.useRef(true);

  useInternalLayoutEffect(() => callback(firstMountRef.current), deps);

  // We tell react that first mount has passed
  useInternalLayoutEffect(() => {
    firstMountRef.current = false;
    return () => {
      firstMountRef.current = true;
    };
  }, []);
};

export const useLayoutUpdateEffect: typeof React.useEffect = (
  callback,
  deps,
) => {
  useLayoutEffect(firstMount => {
    if (!firstMount) {
      return callback();
    }
  }, deps);
};

export default useLayoutEffect;
