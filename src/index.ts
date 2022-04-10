/**
 * @see https://github.com/discord/discord-interactions-js/blob/main/examples/gcloud_function.js
 */

import express from 'express'
import dotenv from 'dotenv'
import { InteractionResponseType, InteractionType } from 'discord-interactions'
import { verifyKeyMiddleware } from './vertifyKeyMiddleware'
import * as instance from './instance'

dotenv.config()

const CLIENT_PUBLIC_KEY = process.env.CLIENT_PUBLIC_KEY
const ZONE = process.env.ZONE || 'asia-northeast1-a'
const INSTANCE_NAME = process.env.INSTANCE_NAME || 'valheim'
const PROJECT_ID = process.env.PROJECT_ID || ''

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
        const status = await instance.status(PROJECT_ID, ZONE, INSTANCE_NAME)
        content = `サーバーの状態は ${status || '不明' } です`
        break
      }
      case 'stop': {
        await instance.stop(PROJECT_ID, ZONE, INSTANCE_NAME)
        content = `Valheimサーバーを停止してます。数分後に停止します。`
        break
      }
      case 'start': {
        await instance.start(PROJECT_ID, ZONE, INSTANCE_NAME)
        content = `Valheimサーバーを起動しています。数分後にアクセスしてみてください。`
        break
      }
      default: {
        content = `Valheimサーバー用コマンドです。`
        break
      }
    }
  } catch(err) {
    sendError(err as Error)
  }

  res.status(200).send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content
    },
  })
})

export const main = app
