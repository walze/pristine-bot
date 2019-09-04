declare module 'wordnet'
declare module 'better-log'
declare module 'jsdom'
declare module "*.json"
declare module "*.txt"

declare module "translate" {
  const definition: {
    (string: string, options: object): Promise<string>
    engine: string,
    key: string,
  }

  export default definition
}

declare module "string.prototype.matchall" {
  export default function matchAll(string: string, regex: RegExp): RegExpMatchArray[]
}