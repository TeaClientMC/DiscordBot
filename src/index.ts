import {
  Client,
  ClientOptions,
  Collection,
  Partials,
  ActivityType,
  GatewayIntentBits,
  TextChannel,
  EmbedBuilder,
  Colors,
} from "discord.js";
import figlet from "figlet";
import gradient from "gradient-string";
import handleEvents from "./functions/handleEvents";
import handleCommands from "./functions/handleCommands";

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


  export let TeaClientGrad = gradient(["#ffffff", "#6e2bec"]);

  client.once("ready", async () => {
    await client.handleCommands();
    await client.handleEvents();
  
    figlet.text(
      client.user?.username ?? "Bot",
      function (err: Error | null, data: string | undefined) {
        if (err) {
          console.log("Something went wrong...");
          console.dir(err);
          return;
        }
        console.log(TeaClientGrad(data));
      }
    );
      console.log(TeaClientGrad(`Logined into ${client.user?.username}: ${client.user?.id}`));


      const upembed = new EmbedBuilder()
      .setColor(Colors.Purple)
      .setDescription(`${client.user?.username} ready and up.`)


      const logsChannel = client.channels.cache.get("1115313973676478464") as TextChannel;
      logsChannel.send({ embeds: [upembed] });


  });

  
  client.login(process.env.TOKEN);

