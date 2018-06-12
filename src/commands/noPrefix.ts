import Action from '../classes/Act';
import Commands from '../classes/Commands';

const momgay = new Action({ prefix: false, text: false },
  req => {
    req.msg.channel.send('no u')
  },
  'no u'
)

Commands.add('mom gay', momgay)