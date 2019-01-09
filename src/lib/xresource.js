import { evolve } from 'ramda'
import { useState, useEffect } from 'react'
import * as rx from 'rxjs'
import * as op from 'rxjs/operators'

const isNil = val =>
  (!Boolean(val) || typeof val === 'undefined') && parseInt(val) !== 0

const isFn = val => typeof val === 'function'
const isObj = val => typeof val === 'object'

const reduceOperations = (state, operations) =>
  Object.entries(operations).reduce(
    (obj, [key, fn]) => ({
      ...obj,
      [key]: isFn(fn)
        ? current => fn(current, state)
        : isObj(fn) && !isNil(fn)
        ? reduceOperations(state)(fn)
        : fn,
    }),
    {},
  )

const fromMapToObject = map =>
  Array.from(map.entries()).reduce(
    (obj, [key, val]) => ({ ...obj, [key]: val }),
    {},
  )

const parseDataWithState = async (obj, state) => {
  const map = new Map(Object.entries(obj))

  for (const [key, cb] of map) {
    try {
      const result = await cb(fromMapToObject(map), state)
      map.set(key, result)
    } catch (err) {
      map.set(key, null)
    }
  }

  return fromMapToObject(map)
}

export const createResource = ({ state, data, operations }) => {
  const state$ = new rx.BehaviorSubject(state)
  const data$ = rx.of(data).pipe(
    op.combineLatest(state$),
    op.map(([obj, state]) => async () => {
      const data = await parseDataWithState(obj, state)
      const customOperations = reduceOperations(state, operations)
      const transform = evolve(customOperations)

      console.log(state)

      return transform(data)
    }),
  )

  return {
    state$,
    data$,
  }
}

export const useResource = ({ data$, state$ }) => {
  const [state, setInnerState] = useState(state$.value)
  const [data, setData] = useState({ loading: true, error: null })

  const setState = value =>
    state$.next(
      isFn(value) ? value(state$.value) : { ...state$.value, ...value },
    )

  const handleState = value => {
    setInnerState(value)
  }

  const handleData = async promise => {
    setData(s => ({ ...s, loading: true }))

    try {
      const res = await promise()
      setData({ ...res, loading: false, error: false })
    } catch (error) {
      setData(s => ({ ...s, error, loading: false }))
    }
  }

  useEffect(() => {
    const stateSubscription = state$.subscribe(handleState)
    const dataSubscription = data$.subscribe(handleData)

    return () => {
      dataSubscription()
      stateSubscription()
      data$.complete()
      state$.complete()
    }
  }, [])

  return [data, state, setState]
}
