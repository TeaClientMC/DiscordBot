const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Ticket, tickets, openTicket } = require('../../handlers/ticketHandler')
require('dotenv').config();
const roleIdsToRemove = ["1144845897491021844"];
const onBreakRoleId = "1144845898434752573";


module.exports = {
    data: new SlashCommandBuilder()
        .setName('break')
        .setDescription('set your break status')
        .addStringOption(option => option.
            setName('choice')
            .setDescription('choose whether on break or not')
            .setRequired(true)
            .addChoices(
                { name: 'Leave', value: 'On' },
                { name: 'Come Back', value: 'Off' }
            )
        ),

    async execute(interaction,client) {
        const options = interaction.options;
        const choice = options.getString('choice')
        let onBreak = options.getString('choice')=="On";
        let guild = interaction.guild;
        let embed;
        let user = guild.members.cache.get(interaction.user.id);
        try {
        if (onBreak) {
            for(roleId of roleIdsToRemove) {
                let role = guild.roles.cache.get(roleId);
                if(role)
                await user.roles.remove(role);
            }
            await user.roles.add(guild.roles.cache.get(onBreakRoleId))
            embed = new EmbedBuilder()
                .setTitle('📫  Updated Your Break Status')
                .setColor(process.env.pending)
                .setFooter({
                    text: "Cordevall - https://github.com/Cordevall",
                    iconURL: "https://avatars.githubusercontent.com/u/143160364?s=200&v=4"
                    })
                .setDescription(`We hope to see you return soon!\nAs a convienceince your staff roles haven been temporarly removed until you return.`)
        } else {
            for(roleId of roleIdsToRemove) {
                let role = guild.roles.cache.get(roleId);
                await user.roles.add(role);
            }
            await user.roles.remove(guild.roles.cache.get(onBreakRoleId))
            embed = new EmbedBuilder()
                .setTitle('📫  Updated Your Break Status ')
                .setColor(process.env.success)
                .setFooter({
                    text: "Cordevall - https://github.com/Cordevall",
                    iconURL: "https://avatars.githubusercontent.com/u/143160364?s=200&v=4"
                    })
                .setDescription(`Welcome back ${interaction.user.username}!\nYour staff roles haven been added back.`)
        }
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Cordevall Error')
                .setDescription(`**Error**\`\`\`${error.rawError.message}\`\`\`\n**Code:** ${error.rawError.code}\n**Method:** ${error.method}`)
                .setFooter({
                    text: "Cordevall - https://github.com/Cordevall",
                    iconURL: "https://avatars.githubusercontent.com/u/143160364?s=200&v=4"
                });
            interaction.reply({ embeds: [errorEmbed] })
        }
        

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}