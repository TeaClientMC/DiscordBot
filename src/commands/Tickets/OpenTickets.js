const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Ticket, tickets, openTicket } = require('../../handlers/ticketHandler')
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('openticket')
        .setDescription('Open a ticket')
        .addStringOption(option => option.
            setName('choices')
            .setDescription('choice of the ticket')
            .setRequired(true)
            .addChoices(
                { name: 'Bug', value: 'Bug' },
                { name: 'Suggestion', value: 'Suggestion' },
                { name: 'Assistance', value: 'Assistance' }
            )
        )
        .addStringOption(option => option
            .setName('message')
            .setDescription('Message')
            .setRequired(true)
            .setMaxLength(250)
        ),

    async execute(interaction,client) {
        const options = interaction.options;
        const choice = options.getString('choices')
        let message = options.getString('message')

        if(tickets.filter((e)=>{
            return (e.createdBy.id==interaction.user.id)
        }).length>0) {
            const embed = new EmbedBuilder()
                .setTitle('🎫  Cordevall Ticket System').setColor(process.env.error)
                .setFooter({
                    text: "Cordevall - https://github.com/Cordevall",
                    iconURL: "https://avatars.githubusercontent.com/u/143160364?s=200&v=4"
                })
                .setDescription(`You already have a open ticket! Please close it before opening a new one by using \`\`/closeticket\`\``)
            interaction.reply({ embeds: [embed], ephemeral: true })
            return;
        }
        
        // Post to discord api to make forum (do this way because discord.js doesnt have way to do it)
        function createForumPost(title,description,author,forum) {
            var axios = require("axios").default;
            const embed = new EmbedBuilder()
                .setTitle('🎫  Cordevall Ticket System').setColor(process.env.pending)
                .setFooter({
                    text: "Cordevall - https://github.com/Cordevall",
                    iconURL: "https://avatars.githubusercontent.com/u/143160364?s=200&v=4"
                })
                .setDescription(`Type: **${choice}**
                Opened: <t:${Math.round(Date.now()/1000)}:R> by ${author}

                Information
                > ${description}`)
            
            // Options/Data needed to post on discord api to create forum channel
            var options = {
                method: 'POST',
                url: `https://discord.com/api/v9/channels/${forum}/threads`,
                headers: {authorization: `Bot ${process.env.token}`},
                data: {
                    name: title,
                    auto_archive_duration: 4320,
                    applied_tags: [],
                    message: { embeds: [embed]}
                }
            };

            axios.request(options).then(function (response) {
                let ticket = new Ticket(interaction.user,response.data.id,message,choice);
                ticket.messages.push({
                    username: "🎫  Cordevall Ticket System",
                    attachments: [],
                    timestamp: new Date().toLocaleString(),
                    message: `${author} opened this ticket, Reason: ${description}`,
                    pfp: `https://avatars.githubusercontent.com/u/143160364?s=200&v=4`
                })
                openTicket(ticket,interaction);
            }).catch(function (error) {
                console.error(error);
            });
        }
// createdBy,forumChannel,reason
        let forumChannel = '';
        switch (choice) {
            case 'Bug': {
                forumChannel = process.env.bugForum;
                break
            }
            case 'Assistance': {
                forumChannel = process.env.helpForum;
                break
            }
            case 'Suggestion': {
                forumChannel = process.env.suggestionsForum;
                break
            }
        }
        const embed = new EmbedBuilder()
            .setTitle('🎫  Cordevall Ticket System')
            .setColor(process.env.success)
            .setFooter({
                text: "Cordevall - https://github.com/Cordevall",
                iconURL: "https://avatars.githubusercontent.com/u/143160364?s=200&v=4"
                })
            .setDescription(`
            Type: **${choice}**
            Opened: <t:${Math.round(Date.now()/1000)}:R>

            Your Has been submitted You will be contacted shortly. 
            Make Sure to check your DMs and have them enabled.`)

        interaction.reply({ embeds: [embed], ephemeral: true })
        let name = `${choice}  |  ${interaction.user.username}  |  `;
        
        // include portion of bug in name of ticket, short name if too long
        if(name.length<95) {
            if(95-name.length<message.length) message = message.substring(0,95-name.length)+"...";
            name+=message;
        }
        
        createForumPost(name,options.getString('message'),interaction.user.username,forumChannel)
    }
}