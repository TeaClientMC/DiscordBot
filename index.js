// Discord bot imports
const {Client, GatewayIntentBits, Partials, Collection, ActivityType, InteractionType, Routes } = require('discord.js');
const {Guilds, GuildMembers, GuildMessages} = GatewayIntentBits;
const {User, Message, GuildMember, ThreadMember, Channel } = Partials;
require('colors');
//-------------------------


//Error handler
const process = require('node:process')
process.on('unhandledRejection',(reason, promise) => {
  console.log('unhandledRejection At:', promise, 'Reason:',reason);
});


const{ loadEvents } = require('./bot/handlers/eventhandler');
const{ loadCommands } = require("./bot/handlers/commandhandler");


const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember],
});
client.commands = new Collection();

client.config = require("./config.json");

client.login(client.config.token).then(() => {
    loadEvents(client);
    loadCommands(client);

});





// Website part!
const express = require('express')
const next = require('next')
const routes = './app/routes'
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

function createApp(express) {
  app.prepare().then(() => {
    const server = express()
  
    server.use('/api', routes)
  
    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
}


//Run app, then load http://localhost:3000 by defualt in a browser to see the output.


