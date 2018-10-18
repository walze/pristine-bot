import CommandRequest from "./bot/classes/Request";

export type actionBehaviour = <T>(request: CommandRequest) => Promise<T>

export interface IImgurResponse {
  id: string,
  title: string,
  description: string,
  datetime: number,
  cover: string,
  cover_width: number,
  cover_height: number,
  account_url: string,
  account_id: number,
  privacy: string,
  layout: string,
  views: number,
  link: string,
  ups: number,
  downs: number,
  points: number,
  score: number,
  is_album: boolean,
  vote: string,
  favorite: boolean,
  nsfw: boolean,
  section: '',
  comment_count: number,
  favorite_count: number,
  topic: string,
  topic_id: number,
  images_count: number,
  in_gallery: boolean,
  is_ad: boolean,
  tags: string[],
  ad_type: number,
  ad_url: '',
  in_most_viral: boolean,
  images: [{
    id: string;
    title: string;
    description: string;
    datetime: number;
    type: string;
    animated: boolean;
    width: number;
    height: number;
    size: number;
    views: number;
    bandwidth: number;
    vote: string;
    favorite: boolean;
    nsfw: string;
    section: string;
    account_url: string;
    account_id: string;
    is_ad: boolean;
    in_most_viral: boolean;
    has_sound: boolean;
    tags: string[];
    ad_type: number;
    ad_url: '';
    in_gallery: boolean;
    link: string;
    comment_count: string;
    favorite_count: string;
    ups: string;
    downs: string;
    points: string;
    score: string;
  }]
}

export interface ITranslator {
  text: '',
  from: {
    language: { didYouMean: boolean; iso: '' };
    text: { autoCorrected: boolean; value: ''; didYouMean: boolean };
  },
  raw: ''
}

export interface Iat {
  type: 'AT' | 'ROLE',
  id: string,
  tag: string
}

export interface IUrbanResponse {
  id: string
  term: string
  url: string
  definition: string
  example: string
  author: string
  author_url: string
  posted: string
}

export interface IDefinitionResponse {
  meta: {
    synsetOffset: number;
    lexFilenum: number;
    synsetType: string;
    wordCount: number;
    words: object[];
    pointerCount: number;
    pointers: object[];
  }
  glossary: string
}
