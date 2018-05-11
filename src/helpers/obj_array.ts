export interface indexObj {
  [key: string]: any
}

export type mapObjCallback = (propValue: any, propName: string) => any

export function mapObj(obj: indexObj, callback: mapObjCallback): any {
  const array = []

  for (let prop in obj)
    array.push(callback(obj[prop], prop))

  return array
}

export function objToArray(obj: object) {
  return mapObj(obj, value => value)
}