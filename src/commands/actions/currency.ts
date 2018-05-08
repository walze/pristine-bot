//import log from "../../helpers/logger";
import Axios, { AxiosError } from "axios";
import log from "../../helpers/logger";
import { action } from "../../types";

export interface currencyParams {
  from: string,
  to: string
}

export const currencyAction: action<currencyParams> = req => {
  if (req.params.text.indexOf('codes') > -1) {
    req.msg.channel.send('https://www.xe.com/iso4217.php')
    return
  }

  if (Boolean(req.params.from) && Boolean(req.params.to)) {
    req.params.from = req.params.from.toUpperCase()
    req.params.to = req.params.to.toUpperCase()

    const fromTo = `${req.params.from}_${req.params.to}`

    Axios.get(`https://free.currencyconverterapi.com/api/v5/convert?q=${fromTo}&compact=y`)
      .then(res => {
        const val = res.data[fromTo].val
        const multiplier = Number(req.params.text)
        if (Boolean(multiplier))
          req.msg.channel.send(`${req.params.text} ${req.params.from} = ${val * multiplier} ${req.params.to}`)
        else
          req.msg.channel.send(`1 ${req.params.from} = ${val} ${req.params.to}`)
      })
      .catch((err: AxiosError) => {
        log(err.response, err.message)

        req.msg.channel.send(`Not Found
${err.message}`)
      })

  }
  else
    req.msg.channel.send('Wrong syntax. s-curr from-\"CURRENCY_CODE\" to-\"CURRENCY_CODE\" \"VALUE OR EMPTY\"')

}