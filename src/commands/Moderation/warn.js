const { PermissionsBitField,SlashCommandBuilder } =  require("discord.js")
const { warnUser } = require('../../handlers/PunishmentHandler')
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warns a member")
    .addUserOption(option => option.setName('user').setDescription('The user you want to warn').setRequired(true))
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
    const reason = options.getString('reason') || "No reason given";

    warnUser(target,interaction.user,reason,interaction)
  }
};
