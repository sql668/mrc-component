import * as React from 'react';

/**
 * Same as `React.useCallback` but always return a memoized function
 * but redirect to real function.
 */
export default function useRefFunc<T extends (...args: any[]) => any>(callback: T): T {
  const funcRef = React.useRef<T>();
  funcRef.current = callback;

  const cacheFn = React.useCallback((...args: any[]) => funcRef.current!(...args), []);

  return cacheFn as any;
}
