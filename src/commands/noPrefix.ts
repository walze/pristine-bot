import Action from '../classes/Act';

export default class noPrefix {

  public static momgay: Action = new Action({ prefix: false, text: false },
    req => {
      req.msg.channel.send('no u')
    },
    'no u'
  )
}