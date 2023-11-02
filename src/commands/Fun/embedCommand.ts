import { PermissionsBitField, SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js'
import { MyClient } from '../..';

export default {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Creates a embed with arguments")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The title on the embed")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("The description of the embed")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Url of where the title should redirect you to")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("hex")
        .setDescription("The color of the embed")
        .setRequired(false)
    ).setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),

  async execute(interaction: ChatInputCommandInteraction, client: MyClient) {
    if (!interaction.member) {
      return await interaction.reply({
        content: "This command cannot be used here!",
        ephemeral: true,
      });
    }

    const options = interaction.options;
    let title = options.getString("title", true);
    let description = options.getString("description");
    let titleUrl = options.getString("url");
    const color = parseInt((options.getString("hex") ?? '')?.replace("#", "0x"));
    
    if (
      options.getString("hex") != null &&
      (color == 0 ||
        color == 16766010 ||
        !options.getString("hex")?.includes("#"))
    ) {
      return interaction.reply({
        content: "Invalid Hex Code! ❌",
        ephemeral: true,
      });
    }
    const embed = new EmbedBuilder();
    
    embed.setColor(color ?? 0xff00ff);
    if (title) embed.setTitle(title);
    if (titleUrl) embed.setURL(titleUrl);
    if (description) embed.setDescription(description);

    embed.setFooter({
      text: "TeaClient - https://github.com/TeaClient/DiscordBot",
      iconURL: client.user!.avatarURL()!,
    });

    interaction.reply({ content: "Embed Created! ✅", ephemeral: true });

    interaction.channel!.send({ embeds: [embed] });
  },
};
