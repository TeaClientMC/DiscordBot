import { ChatInputCommandInteraction, Collection, Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { MyClient } from "../..";

export default {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("reloads your events and commands"),
    Emoji: "♻️",
    
async execute(interaction: ChatInputCommandInteraction, client: MyClient) {
      // Fetch the member who initiated the interaction
      const member = await interaction.guild?.members.fetch(interaction.user.id);
      
      // Check if the member has the 'developer' role or a role with higher permissions
      // Replace 'ROLE_ID' with the actual Role ID of the 'developer' role
      if (!member?.roles.cache.some(role => role.permissions.has('Administrator') || role.id == "")) {
        return interaction.reply({ content: 'You do not have the necessary permissions to use this command.', ephemeral: true });
      }
        
      
      const embed = new EmbedBuilder()
        .setColor(Colors.White)
        .setFooter({
          text: "TeaClient - https://github.com/TeaClient/DiscordBot",
          iconURL: client.user!.avatarURL()!,
        })
        .setDescription(`Reloading Coredevall commands..`);
    
      interaction.reply({ embeds: [embed], ephemeral: true });
      client.commandArray = []
      client.commands = new Collection()
      await client.handleCommands()
      client.removeAllListeners()
      await client.handleEvents()

    
      setTimeout(() => {
        const embed = new EmbedBuilder()
          .setColor(Colors.DarkPurple)
          .setFooter({
            text: "TeaClient - https://github.com/TeaClient/DiscordBot",
            iconURL: client.user!.avatarURL()!,
          })
          .setDescription(`Successfully Reloaded Cordevall 🎉🥳`);
        interaction.editReply({ embeds: [embed]  }).catch(console.error);
      }, 2000);
    },
};
