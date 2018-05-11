import Act from '../classes/Act';

export default class noPrefix {

  public static momgay: Act = new Act({},
    req => {
      req.msg.channel.send('no u')
    },
    'no u'
  )
}