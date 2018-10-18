declare module 'wordnet';
declare module 'better-log';
declare module 'jsdom';
declare module 'google-translate-api';
declare module "*.json" {
  const value: any;
  export default value;
}
declare module "*.txt" {
  const content: string;
  export default content;
}
