import { IImgurResponse } from '../../types';
import Axios from 'axios';
import { RichEmbedOptions } from 'discord.js';
import { createAction } from '.';
import { Actions } from './helpers/enum';
import { mutateCommand } from '../command';

const requirements = {
  album: false,
  image: false,
}

const description = 'Searches images on Imgur'

// yes, i know
const config = { client_id: "bebb4e6140bcb51" }

createAction(
  Actions.imgur,
  description,
  requirements,
  async cmd => {
    const { flags, message } = cmd

    const response = await Axios
      .get(`https://api.imgur.com/3/gallery/search/?q=${cmd.content}`, {
        headers: { Authorization: `Client-ID ${config.client_id}` },
      })
      .then(async res => {
        const albums: IImgurResponse[] = res.data.data

        if (albums.length < 1) throw new Error(`Nothing found on "${cmd.content}"`)

        const filtered = filter(albums)

        const indexes = {
          album: Number(flags.album) - 1,
          image: Number(flags.image) - 1,
        }

        console.log(indexes)

        const params = {
          id: indexes.album || 0,
          image_id: indexes.image || 0,
          album: filtered[indexes.album || 0],
          image: filtered[indexes.album || 0].images[indexes.image || 0],
        }

        const embed: RichEmbedOptions = {
          author: {
            name: message.author.username,
            icon_url: message.author.avatarURL,
          },
          title: params.album.title,
          description: params.album.description,
          image: { url: params.image },
          timestamp: new Date(),
        }

        const text = `Album #${params.id + 1} out of ${filtered.length}\nImage #${params.image_id + 1} out of ${params.album.images.length} `

        return { text, embed }
      })

    return mutateCommand(
      cmd,
      {
        content: response.text,
        messageSendOptions: { embed: response.embed },
      },
    )
  },
)

function filter(albums: IImgurResponse[]) {
  return albums
    .filter(album => album.images_count >= 1)
    .map(album => {
      return {
        title: album.title,
        description: album.description,
        images: album.images.map(img => img.link),
      };
    })
}