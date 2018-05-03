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

export interface dictionary {
  status: string
  offset: string
  limit: string
  count: string
  total: string
  url: string
  results: [
    {
      datasets: string[],
      headword: string,
      id: string,
      part_of_speech: string,
      senses: [
        {
          definition: string,
          examples: [{ text: string }]
        }
      ],
      url: string
    }]
}