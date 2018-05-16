import { isObject } from 'util';

export interface indexObj {
  [key: string]: any
}

export type mapObjCallback = (propValue: any, propName: string) => any

export function mapObj(obj: any, callback: mapObjCallback): any {
  if (!isObject(obj)) throw new Error('Not Object')

  const array = []

  for (let prop in obj)
    array.push(callback(obj[prop], prop))

  return array
}

export function objToArray(obj: object) {
  return mapObj(obj, value => value)
}