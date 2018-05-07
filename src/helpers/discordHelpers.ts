import { isArray } from "util";

export function embed(text: string[] | string) {
  if (isArray(text)) text.join('')

  return `\`\`\`${text}\`\`\``
}