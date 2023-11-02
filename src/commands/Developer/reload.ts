import { ChatInputCommandInteraction, Collection, Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { MyClient } from "../..";

export default {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("reloads your events and commands"),

  async execute(interaction: ChatInputCommandInteraction, client: MyClient) {
    const embed = new EmbedBuilder()
      .setColor(Colors.Grey)
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
        .setColor(Colors.White)
        .setFooter({
          text: "TeaClient - https://github.com/TeaClient/DiscordBot",
          iconURL: client.user!.avatarURL()!,
        })
        .setDescription(`Successfully Reloaded Cordevall 🎉🥳`);

      interaction.editReply({ embeds: [embed] });
    }, 2000);
  },
};
