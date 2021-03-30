import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const apiEndpoint = process.env.DISCORD_API_ENDPOINT
const botToken = process.env.DISCORD_BOT_TOKEN
const commandId = process.env.COMMAND_ID


/**
 * @ref https://discord.com/developers/docs/interactions/slash-commands#create-global-application-command
 */
 const createApi = (apiEndpoint: string) => {

  const headers = {
    'Authorization': 'Bot ' + botToken,
    'Content-Type': 'application/json'
  }

  const create = (body: Object) => fetch(apiEndpoint, {
    method: 'post',
    body: JSON.stringify(body),
    headers,
  }).then(res => res.json())

  const edit = (commandId: string, body: Object) => fetch(`${apiEndpoint}/${commandId}`, {
    method: 'patch',
    body: JSON.stringify(body),
    headers,
  }).then(res => res.json())

  const destroy = (commandId: string) => fetch(`${apiEndpoint}/${commandId}`, {
    method: 'delete',
    headers,
  })

  const get = (commandId: string) => fetch(`${apiEndpoint}/${commandId}`, {
    method: 'get',
    headers,
  }).then(res => res.json())

  const list = () => fetch(apiEndpoint, {
    method: 'get',
    headers,
  }).then(res => res.json())

  return {
    get,
    list,
    create,
    edit,
    destroy,
  }
}

const main = async () => {
  if(!apiEndpoint) throw new Error('No api endpoint')
  if(!botToken) throw new Error('No bot token')
  if(!commandId) throw new Error('No command id')

  const commandData = {
    name: "valheim",
    description: "Valheimサーバーの起動コマンド",
    options: [
      {
        name: "start",
        description: "Valheimサーバーを起動します",
        type: 1, // SUB_COMMAND
      },
      {
        name: "stop",
        description: "Valheimサーバーを停止します",
        type: 1, // SUB_COMMAND
      },
      {
        name: "status",
        description: "Valheimサーバーの状態を確認します",
        type: 1, // SUB_COMMAND
      }
    ]
  }

  const api = createApi(apiEndpoint)
  const data = await api.edit(commandId, commandData)
  console.log(data)
}

main()
