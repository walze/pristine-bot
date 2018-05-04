//import log from "../../helpers/logger";
import Axios, { AxiosError } from "axios";
import log from "../../helpers/logger";
import { action } from "../../types";

export interface currencyParams {
  from: string,
  to: string
}

export const currencyAction: action<currencyParams> = (msg, params) => {
  if (params.text.indexOf('codes') > -1) {
    msg.channel.send('https://www.xe.com/iso4217.php')
    return null
  }

  if (Boolean(params.from) && Boolean(params.to)) {
    params.from = params.from.toUpperCase()
    params.to = params.to.toUpperCase()

    const fromTo = `${params.from}_${params.to}`

    Axios.get(`https://free.currencyconverterapi.com/api/v5/convert?q=${fromTo}&compact=y`)
      .then(res => {
        const val = res.data[fromTo].val
        const multiplier = Number(params.text)
        if (Boolean(multiplier))
          msg.channel.send(`${params.text} ${params.from} = ${val * multiplier} ${params.to}`)
        else
          msg.channel.send(`1 ${params.from} = ${val} ${params.to}`)
      })
      .catch((err: AxiosError) => {
        log(err.response, err.message)

        msg.channel.send(`Not Found
${err.message}`)
      })

  }
  else
    msg.channel.send('Wrong syntax. s-curr from-\"CURRENCY_CODE\" to-\"CURRENCY_CODE\" \"VALUE OR EMPTY\"')

}