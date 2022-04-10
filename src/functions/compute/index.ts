/**
 * @see https://github.com/discord/discord-interactions-js/blob/main/examples/gcloud_function.js
 */

import dotenv from 'dotenv'
import fetch from 'node-fetch'
import * as instance from '../../instance'

dotenv.config()

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || ''
const ZONE = process.env.ZONE || 'asia-northeast1-a'
const INSTANCE_NAME = process.env.INSTANCE_NAME || 'valheim'
const PROJECT_ID = process.env.PROJECT_ID || ''

const sendMessage = async (content: string) => {
  await fetch(DISCORD_WEBHOOK_URL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
    })
  })
}

const sendError = async (err: Error) => {
  console.error(err)
  return await sendMessage(`コマンドの実行に失敗しました。`)
}

const app = async (event: any) => {
  const message = JSON.parse(Buffer.from(event.data, 'base64').toString())
  console.log('From Pub/Sub', message)

  let content = ''

  try {
    switch(message.commandType) {
      case 'status': {
        const status = await instance.status(PROJECT_ID, ZONE, INSTANCE_NAME)
        content = `サーバーの状態は ${status || '不明' } です`
        break
      }
      case 'stop': {
        await instance.stop(PROJECT_ID, ZONE, INSTANCE_NAME)
        content = `Valheimサーバーを停止します。`
        break
      }
      case 'start': {
        await instance.start(PROJECT_ID, ZONE, INSTANCE_NAME)
        content = `Valheimサーバーを起動します。数分後にアクセスしてみてください。`
        break
      }
      default: {
        content = `Valheimサーバー用コマンドです。`
        break
      }
    }
  } catch(err) {
    await sendError(err as Error)
  }

  await sendMessage(content)
}

export const main = app
