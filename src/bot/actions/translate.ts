import { createAction } from "."
import { Actions } from "./enum"

createAction(
  Actions.translate,
  'Translates given text to ~~almost~~ any language ~~precision not guaranteed~~',
  () => {
    console.log('hit')

    return new Promise(rs => rs());
  },
)
