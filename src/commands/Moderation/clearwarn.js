const { Permissions, EmbedBuilder, CommandInteraction,SlashCommandBuilder,PermissionsBitField } = require("discord.js");
const { punishments } =require('../../handlers/PunishmentHandler');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearwarn")
    .setDescription("Clear a member's warnings")
    .addUserOption(option => option.setName('user').setDescription('The user you want to check warns').setRequired(true)),
  async execute(interaction) {
    if(!interaction.member) {
      return await interaction.reply({ content: "This command cannot be used here!", ephemeral: true });
    }
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return await interaction.reply({ content: "You don't have the permission to use this command!", ephemeral: true });
    }
    const { options } = interaction;
    const target = options.getUser('user');
    let user = punishments[target.id];
    user.warnings = [];


    let warnings = user.warnings.length?user.warnings.length:0;
    let kicks = user.kicks.length?user.kicks.length:0;
    let bans = user.bans.length?user.bans.length:0;
    const embed2 = new EmbedBuilder()
      .setColor(0x00FFAA)
      .setTitle('👮  Cordevall Punishment System')
      .setDescription(`Your warnings have been cleared!`)
      .setFooter({
          text: "Cordevall - https://github.com/Cordevall",
          iconURL: "https://avatars.githubusercontent.com/u/143160364?s=200&v=4"
      })
      .addFields(
          {
              name: "__Warnings:__",
              value: `\`\`\`${warnings}\`\`\``,
              inline: true,
          },
          {
              name: "__Kicks:__",
              value: `\`\`\`${kicks}\`\`\``,
              inline: true,
          },
          {
              name: "__Bans:__",
              value: `\`\`\`${bans}\`\`\``,
              inline: true,
          }
      );
    user.send({embeds:[embed2]})
    const embed = new EmbedBuilder()
      .setColor(0x00FFAA)
      .setTitle('👮  Cordevall Punishment System')
      .setDescription(`Cleared Warnings on \`${target.username}\``)
      .setFooter({
          text: "Cordevall - https://github.com/Cordevall",
          iconURL: "https://avatars.githubusercontent.com/u/143160364?s=200&v=4"
      })
      .addFields(
          {
              name: "__Warnings:__",
              value: `\`\`\`${warnings}\`\`\``,
              inline: true,
          },
          {
              name: "__Kicks:__",
              value: `\`\`\`${kicks}\`\`\``,
              inline: true,
          },
          {
              name: "__Bans:__",
              value: `\`\`\`${bans}\`\`\``,
              inline: true,
          }
      );

    interaction.reply({ embeds: [embed] })
  },
};
