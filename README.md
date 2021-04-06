# Valheim Discord Bot

## Setup

```bash
$ git clone git@github.com:nyawach/valheim.git
$ cd valheim/
```

```bash
$ npm i
```

Set .env file

```
DISCORD_API_ENDPOINT=<Cloud Functions Endpoint URL>
DISCORD_BOT_TOKEN=<Discord Bot Token>
COMMAND_ID=<Discord Slash Command ID>
CHANNEL_ID=<Channel ID>
CLIENT_PUBLIC_KEY=<Public Key>
```

Register slash commands

```bash
$ npm run register
```

Build and deploy (you need to sign in your GCP project)

```bash
$ npm run build
$ npm run functions:deploy
```
