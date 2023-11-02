const { Permissions, EmbedBuilder, CommandInteraction,SlashCommandBuilder,PermissionsBitField } = require("discord.js");
const { punishments, getOrCreateUserPunishments } =require('../../handlers/PunishmentHandler');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member using Cordevall")
    .addUserOption(option => option.setName('user').setDescription('The user you want to kick').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('This is the reason for warning the user').setRequired(false)),

  async execute(interaction) {
    if(!interaction.member) {
      return await interaction.reply({ content: "This command cannot be used here!", ephemeral: true });
    }
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return await interaction.reply({ content: "You don't have the permission to use this command!", ephemeral: true });
    }
    const { options } = interaction;
    const target = options.getUser('user');
    const reason = options.getString('reason');

    let user = getOrCreateUserPunishments(target.id)

    const embed2 = new EmbedBuilder()
      .setColor(0xff8c00)
      .setTitle('👮  Cordevall Punishment System')
      .setFooter({
          text: "Cordevall - https://github.com/Cordevall",
          iconURL: "https://avatars.githubusercontent.com/u/143160364?s=200&v=4"
      })
      .setDescription(`🛑 **You have been kicked from ${interaction.guild.name}** by ${interaction.user.username} 🛑
     
      **Reason:** ${reason}`);

    await target.send({embeds:[embed2]}).then(()=>{
      interaction.guild.members.kick(target,{reason:reason})
    });


    const successEmbed = new EmbedBuilder()
      .setColor(0x00FFAA)
      .setTitle('👮  Cordevall Punishment System')
      .setFooter({
          text: "Cordevall - https://github.com/Cordevall",
          iconURL: "https://avatars.githubusercontent.com/u/143160364?s=200&v=4"
      })
      .addFields(
          {
              name: "__Warnings:__",
              value: `\`\`\`${user.warnings.length}\`\`\``,
              inline: true,
          },
          {
              name: "__Kicks:__",
              value: `\`\`\`${user.kicks.length+1}\`\`\``,
              inline: true,
          },
          {
              name: "__Bans:__",
              value: `\`\`\`${user.bans.length}\`\`\``,
              inline: true,
          }
      )
      .setDescription(`:white_check_mark: Successfully **kicked** \`${target.username}\` from ${interaction.guild.name}\n\n**Reason:** ${reason}`);

    interaction.reply({ embeds: [successEmbed] })
  },
};
