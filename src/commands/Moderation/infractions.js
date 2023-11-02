const { Permissions, EmbedBuilder, CommandInteraction,SlashCommandBuilder,PermissionsBitField} = require("discord.js");
const { punishments } =require('../../handlers/PunishmentHandler');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("infractions")
    .setDescription("Checks a member's warnings")
    .addUserOption(option => option.setName('user').setDescription('The user you want to check warns').setRequired(true))
    .addStringOption(option => option
      .setName('category')
      .setRequired(false)
      .setDescription("Category")
      .addChoices(
          { name: 'Warnings', value: 'Warnings' },
          { name: 'Bans', value: 'Bans' },
          { name: 'Kicks', value: 'Kicks' }
      )
    ),
  async execute(interaction) {
    if(!interaction.member) {
      return await interaction.reply({ content: "This command cannot be used here!", ephemeral: true });
    }
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return await interaction.reply({ content: "You don't have the permission to use this command!", ephemeral: true });
    }

    const { options, guildId } = interaction;
    const target = options.getUser('user');
    const category = options.getString('category');

    let user = punishments[target.id];
    if(!user) {
      user = {
        id: target.id,
        warnings: [],
        kicks: [],
        bans: []
      }
    }

    // Function to format the data
    function formatData(data) {
      return `**Date:** ${data.date}
      **Issuer:** ${data.issuer}
      **Reason:** ${data.reason}`;
    }

    const embed = new EmbedBuilder()
      .setColor(0x00FFAA)
      .setTitle('👮  Cordevall Punishment System')
      .setDescription(`Punishment info on \`${target.username}\``)
      .setFooter({
          text: "Cordevall - https://github.com/Cordevall",
          iconURL: "https://avatars.githubusercontent.com/u/143160364?s=200&v=4"
      });
    if(!category) {
      embed.addFields(
        {
            name: "__Warnings:__",
            value: `\`\`\`${user.warnings.length}\`\`\``,
            inline: true,
        },
        {
            name: "__Kicks:__",
            value: `\`\`\`${user.kicks.length}\`\`\``,
            inline: true,
        },
        {
            name: "__Bans:__",
            value: `\`\`\`${user.bans.length}\`\`\``,
            inline: true,
        }
      );
    }
    if(category=="Warnings") {
      let index = 1;
      for(warning of user.warnings) {
        embed.addFields({ 
          name: `__Warning #${index}__`,
          value: ">>> "+formatData(warning),
          inline: !(index%3==0 )
        });
        index++;
      }
    }
    if(category=="Bans") {
      let index = 1;
      for(bans of user.bans) {
        embed.addFields({ 
          name: `__Ban #${index}__`,
          value: ">>> "+formatData(ban),
          inline: true 
        });
        index++;
      }
    }
    if(category=="Kicks") {
      let index = 1;
      for(kick of user.kicks) {
        embed.addFields({ 
          name: `__Kick #${index}__`,
          value: ">>> "+formatData(kick),
          inline: true 
        });
        index++;
      }
    }

    interaction.reply({ embeds: [embed] })
  },
};
