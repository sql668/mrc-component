import * as React from 'react';



import canUseDom from '../dom/canUseDom';


/**
 * Wrap `React.useLayoutEffect` which will not throw warning message in test env
 */
const useInternalLayoutEffect =
  process.env.NODE_ENV !== 'test' && canUseDom() ? React.useLayoutEffect : React.useEffect;

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

/** 内部利用 ref 结合 useLayoutEffect 做到了仅在依赖值更新时调用 callback 首次渲染并不执行。 */
export const useLayoutUpdateEffect: typeof React.useEffect = (callback, deps) => {
  useLayoutEffect((firstMount) => {
    if (!firstMount) {
      return callback();
    }
  }, deps);
};

export default useLayoutEffect;