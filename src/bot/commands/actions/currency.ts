// import log from "../../helpers/logger";
import Axios from "axios";
import { actionBehaviour } from "../../../types";
import { Requirements } from '../../classes/Requirements';
import Action from '../../classes/Action';
import Commands from '../../classes/Commands';

const requirements: Requirements = {
  text: false,
  params: {
    from: false,
    to: true,
  },
}

const description = 'Converts currencies, default "from" is USD\nhttps://www.xe.com/iso4217.php'

const action: actionBehaviour = async req => {

  req.params.from = req.params.from ? req.params.from.toUpperCase() : 'USD'
  req.params.to = req.params.to.toUpperCase()

  const fromTo = `${req.params.from}_${req.params.to}`

  return Axios.get(`https://free.currencyconverterapi.com/api/v5/convert?q=${fromTo}&compact=y`)
    .then(async res => {
      const resFromTo = res.data[fromTo]

      if (!resFromTo) {
        throw new Error('Your request could not be found, check if the Currency Codes are correct.')
      }

      const val = resFromTo.val
      const multiplier = Number(req.text)

      if (Boolean(multiplier))
        return req.msg.channel.send(`\`\`${req.text} ${req.params.from} = ${val * multiplier} ${req.params.to}\`\``)

      return req.msg.channel.send(`\`\`1 ${req.params.from} = ${val} ${req.params.to}\`\``)
    })

}

const currency = new Action(requirements, action, description)
Commands.add('curr', currency)
