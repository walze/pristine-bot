import { isObject } from 'util';

export interface IIndexObj {
  [key: string]: any
}

export type mapObjCallback = (propValue: any, propName: string) => any

export function mapObj(obj: any, callback: mapObjCallback): any {
  if (!isObject(obj)) throw new Error('Not Object')

  const array = []

  for (const prop in obj)
    array.push(callback(obj[prop], prop))

  return array
}

export function objToArray(obj: object) {
  return mapObj(obj, value => value)
}
