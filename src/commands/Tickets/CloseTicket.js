const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { client } = require('../../index.js')
const { closeTicket } = require('../../handlers/ticketHandler.js')
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('closeticket')
        .setDescription('Close a ticket')
        .addStringOption(option => option
            .setName('message')
            .setDescription('Message')
            .setRequired(false)
            .setMaxLength(250)
        ),

    async execute(interaction, client) {
        // Post to discord api to make forum (do this way because discord.js doesnt have way to do it)
        const options = interaction.options;
        let message = options.getString('message')?options.getString('message'):"None";
        let inForum = interaction.channel?.type==11?true:false;
        if(!(await closeTicket(inForum,message,interaction.user,interaction.channelId))) {
            const embed = new EmbedBuilder()
                .setTitle('Couldnt find ticket')
                .setColor(process.env.failure)
                .setFooter({
                    text: "Cordevall - https://github.com/Cordevall",
                    iconURL: "https://avatars.githubusercontent.com/u/143160364?s=200&v=4"
                })
                .setDescription(`Your ticket has either already been closed or no longer exists.`)

            interaction.reply({ embeds: [embed], ephemeral: true })
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('Closing Ticket..')
            .setColor(process.env.pending)
            .setFooter({
                text: "Cordevall - https://github.com/Cordevall",
                iconURL: "https://avatars.githubusercontent.com/u/143160364?s=200&v=4"
            })
            .setDescription(`
            This ticket has been closed. Your ticket will now be archived..
            Reason: ${message}`)

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}
