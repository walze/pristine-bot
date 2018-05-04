// used for global types

export interface Urban {
  id: string
  term: string
  url: string
  definition: string
  example: string
  author: string
  author_url: string
  posted: string
}

export interface definition {
  meta: {
    synsetOffset: number,
    lexFilenum: number,
    synsetType: string,
    wordCount: number,
    words: object[],
    pointerCount: number,
    pointers: object[]
  },
  glossary: string
}