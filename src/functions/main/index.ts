/**
 * @see https://github.com/discord/discord-interactions-js/blob/main/examples/gcloud_function.js
 */

import express from 'express'
import dotenv from 'dotenv'
import { InteractionResponseType, InteractionType } from 'discord-interactions'
import { verifyKeyMiddleware } from '../../vertifyKeyMiddleware'
import { publishMessage } from '../../pubsub'

dotenv.config()

const CLIENT_PUBLIC_KEY = process.env.CLIENT_PUBLIC_KEY

const app = express()

app.use(express.raw())

app.post('/', verifyKeyMiddleware(CLIENT_PUBLIC_KEY || ''), async (req, res) => {

  const sendError = (err: Error) => {
    console.error(err)
    res.end({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `コマンドの実行に失敗しました。`
      },
    })
  }

  const interaction = req.body

  if(!(interaction && interaction.type === InteractionType.APPLICATION_COMMAND)) {
    sendError(new Error('コマンドの実行に失敗しました。'))
  }

  const option = interaction.data.options[0]

  if(!option) {
    sendError(new Error('コマンドの実行に失敗しました。'))
  }

  let content = ''

  try {
    switch(option.name) {
      case 'status': {
        await publishMessage('status')
        content = `サーバーの状態を確認してます...`
        break
      }
      case 'stop': {
        await publishMessage('stop')
        content = `Valheimサーバーを停止してます...`
        break
      }
      case 'start': {
        await publishMessage('start')
        content = `Valheimサーバーを起動しています...`
        break
      }
      default: {
        content = `Valheimサーバー用コマンドです。`
        break
      }
    }
  } catch(err) {
    sendError(err as Error)
    return
  }

  res.status(200).send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content
    },
  })
})

export const main = app
