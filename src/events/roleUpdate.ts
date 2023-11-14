import { ChatInputCommandInteraction, EmbedBuilder, Role, TextChannel} from "discord.js";
import { MyClient } from "..";

export default {
    name: 'roleUpdate',
    async execute(interaction: ChatInputCommandInteraction, oldRole: Role, newRole: Role, client: MyClient) {
      const logsChannel = client.channels.cache.get("1115313973676478464") as TextChannel;

  // Check if the channel exists and is a text channel

  // Create an embed message
  const embed = new EmbedBuilder()
    .setTitle('Role Updated')
    .setDescription(`The role ${oldRole.name} has been updated to ${newRole.name}.`)
    .setColor("Purple")
    .setTimestamp(Date.now());

  // Send the embed to the logs channel
  logsChannel.send({ embeds: [embed] });
    },
    
    
      // ----------






}