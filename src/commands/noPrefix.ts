import Action from '../classes/Action';
import Commands from '../classes/Commands';

const momgay = new Action({ prefix: false, text: false },
  req => {
    return req.msg.channel.send('no u')
  },
  'no u',
)

Commands.add('mom gay', momgay)
