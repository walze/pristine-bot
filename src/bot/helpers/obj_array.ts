import { isObject } from 'util';

export type ValueOf<T> = T[Extract<keyof T, string>]

export interface IIndexObj<T> {
  [key: string]: ValueOf<T>
}

export function mapObj<A, B>(
  obj: A,
  callback: (
    TValue: ValueOf<A>,
    TProp: string,
  ) => B | void,
) {
  if (!isObject(obj)) throw new Error(`Not Object, ${typeof obj} instead`)

  const array: Array<B | void> = []

  // tslint:disable-next-line:forin
  for (const prop in obj) {
    const value: ValueOf<A> = obj[prop]
    const newValue = callback(value, prop)
    array.push(newValue)
  }

  return array
}

export function objToArray<T>(obj: T) {
  return mapObj(obj, value => value)
}
