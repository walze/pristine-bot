import Action from "../../../bot/classes/Action";
import Commands from '../../../bot/classes/Commands';
import WordsMod from '../../../database/classes/Balance';

const wallet = new Action(
  { text: false },

  async req => {
    const user = await WordsMod.getWallet(req.msg.author.username, req.msg.author.discriminator)

    if (!user) return req.msg.reply('you have no wallet yet. Try saying something nice so I can make you one.')

    const congrat = user.goods > user.bads ?
      "You've said more good things, Good Job!" :
      "You've said more bad things, hmpf!"

    return req.msg.channel.send(congrat,
      {
        embed: {
          title: "Wallet",
          fields: [
            { name: 'Goods', value: user.goods, inline: true },
            { name: 'Bads', value: user.bads, inline: true },
            { name: 'Balance', value: user.balance + '$' },
          ],
        },
      },
    )
  },

  'Shows your wallet',
)

Commands.add('wallet', wallet)
