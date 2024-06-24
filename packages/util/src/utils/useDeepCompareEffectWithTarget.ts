import { BasicTarget } from "ahooks/lib/utils/domTarget"
import { DependencyList, EffectCallback, useRef } from "react"
import useEffectWithTarget from "./useEffectWithTarget"
import depsEqual  from "./depsEqual"

const useDeepCompareEffectWithTarget = (
  effect: EffectCallback,
  deps: DependencyList,
  target: BasicTarget<any> | BasicTarget<any>[],
) => {
  const ref = useRef<DependencyList>()
  const signalRef = useRef<number>(0)

  if (!depsEqual(deps, ref.current)) {
    ref.current = deps
    signalRef.current += 1
  }

  useEffectWithTarget(effect, [signalRef.current], target)
}

export default useDeepCompareEffectWithTarget
