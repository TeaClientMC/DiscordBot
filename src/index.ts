import {
  Client,
  ClientOptions,
  Collection,
  Partials,
  ActivityType,
  GatewayIntentBits,
} from "discord.js";
import { Routes } from "discord-api-types/v10";
import fs from "fs";
import handleEvents from "./functions/handleEvents";
import handleCommands from "./functions/handleCommands";
import { join, resolve } from "path";

export class MyClient extends Client {
  commands: Collection<string, any>;
  commandArray: any[] = [];

  declare handleEvents: () => Promise<any>;
  declare handleCommands: () => Promise<any>;

  constructor(options: ClientOptions = { intents: [] }) {
    super(options);
    this.commands = new Collection();

    this.handleEvents = handleEvents(this);
    this.handleCommands = handleCommands(this);
  }
}

const client = new MyClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
  ],
  partials: [
    Partials.User,
    Partials.Message,
    Partials.GuildMember,
    Partials.ThreadMember,
  ],
});

client.once("ready", async () => {
  await client.handleCommands();
  await client.handleEvents();

  console.log("yay");
  console.log(`Logined to ${client.user?.username}`);
});

client.login(process.env.token);
console.log("starting");
