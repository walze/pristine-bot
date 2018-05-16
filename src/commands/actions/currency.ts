//import log from "../../helpers/logger";
import Axios from "axios";
import { actionType } from "../../types";
import { Requirements } from '../../classes/Requirements';
import Act from '../../classes/Act';

const requirements: Requirements = {
  text: false,
  params: {
    from: false,
    to: true
  }
}

const description = 'Converts currencies, default "from" is USD\nhttps://www.xe.com/iso4217.php'

const action: actionType = async req => {

  req.params.from = req.params.from ? req.params.from.toUpperCase() : 'USD'
  req.params.to = req.params.to.toUpperCase()

  const fromTo = `${req.params.from}_${req.params.to}`

  return await Axios.get(`https://free.currencyconverterapi.com/api/v5/convert?q=${fromTo}&compact=y`)
    .then(async res => {
      const resFromTo = res.data[fromTo]
      if (!resFromTo) throw new Error('Your request could not be found or fulfilled')
      const val = resFromTo.val
      const multiplier = Number(req.text)

      if (Boolean(multiplier))
        return await req.msg.channel.send(`\`\`${req.text} ${req.params.from} = ${val * multiplier} ${req.params.to}\`\``)
      else
        return await req.msg.channel.send(`\`\`1 ${req.params.from} = ${val} ${req.params.to}\`\``)
    })

}

const currency = new Act(requirements, action, description)
export default currency
