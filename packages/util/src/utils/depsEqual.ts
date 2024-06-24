import type { DependencyList } from 'react'
import isEqual from 'react-fast-compare'

const  depsEqual = (aDeps: DependencyList = [], bDeps: DependencyList = []) =>
  isEqual(aDeps, bDeps)

export default depsEqual
