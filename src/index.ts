/**
 * @see https://github.com/discord/discord-interactions-js/blob/main/examples/gcloud_function.js
 */

import express from 'express'
// @ts-ignore
import Compute from '@google-cloud/compute'
import dotenv from 'dotenv'
import { InteractionResponseType, InteractionType } from 'discord-interactions'
import { verifyKeyMiddleware } from './vertifyKeyMiddleware'

dotenv.config()

const CLIENT_PUBLIC_KEY = process.env.CLIENT_PUBLIC_KEY

const compute = new Compute()
const zone = compute.zone('asia-northeast1-a')
const vm = zone.vm('valheim')

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

  switch(option.name) {
    case 'status': {
      content = `Valheimサーバー用のコマンド status は未実装です。`
      break
    }
    case 'stop': {
      await vm.stop().catch(sendError)
      content = `Valheimサーバーを停止してます。数分後に停止します。`
      break
    }
    case 'start': {
      await vm.start().catch(sendError)
      content = `Valheimサーバーを起動しています。数分後にアクセスしてみてください。`
      break
    }
    default: {
      content = `Valheimサーバー用コマンドです。`
      break
    }
  }

  res.status(200).send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content
    },
  })
})

export const main = app
