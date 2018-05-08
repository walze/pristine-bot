//import log from "../../helpers/logger";
import Axios, { AxiosError } from "axios";
import { action, FromToParams } from "../../types";

export const currencyAction: action<FromToParams> = req => {
  if (req.text.indexOf('codes') > -1) {
    req.msg.channel.send('https://www.xe.com/iso4217.php')
    return
  }

  if (Boolean(req.params.from) && Boolean(req.params.to)) {
    req.params.from = req.params.from.toUpperCase()
    req.params.to = req.params.to.toUpperCase()

    const fromTo = `${req.params.from}_${req.params.to}`

    return Axios.get(`https://free.currencyconverterapi.com/api/v5/convert?q=${fromTo}&compact=y`)
      .then(res => {
        const val = res.data[fromTo].val
        const multiplier = Number(req.text)
        if (Boolean(multiplier))
          req.msg.channel.send(`\`\`${req.text} ${req.params.from} = ${val * multiplier} ${req.params.to}\`\``)
        else
          req.msg.channel.send(`\`\`1 ${req.params.from} = ${val} ${req.params.to}\`\``)
      })

  }
  else
    req.msg.channel.send('Wrong syntax. s-curr from-\"CURRENCY_CODE\" to-\"CURRENCY_CODE\" \"VALUE OR EMPTY\"')

}