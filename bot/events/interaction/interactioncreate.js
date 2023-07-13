// **Can change but may require basic js knowlodge**

// ---------------------------------------------------

// neededed veriables!
const { EmbedBuilder } = require('discord.js');


// ----------------------------------------------------


module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {
    
    // dev Id list here you can continue on.
    const config = require('../../../config.json')
    const dev1 = (config.devID1)
    const dev2 = (config.devID2)
    const owner = process.env.ownerID
    


        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName); // looking for commands
            if (!command) {
                return interaction.reply({content: "Outdated command! Please Wait commands will be updated soon.", ephemeral: true});
            }

    
            
            // in order to use this with your command after the command before aysnc add devonly: true,
                if (command.devonly && interaction.user.id !== dev1 && interaction.user.id !==  dev2) {
                return interaction.reply({
                   embeds: [
                       new EmbedBuilder()
                           .setColor("Yellow")
                           .setDescription(':warning: | This command is for Develepors only')
                   ],
                   ephemeral: true
               });
               } // you can keep adding "&& interaction.user.id != dev*"
               
               // ----------


               if (command.owneronly && interaction.user.id != owner ) {
                return interaction.reply({
                   embeds: [
                       new EmbedBuilder()
                           .setColor("Yellow")
                           .setDescription(':warning: | This command is for the bot owner only')
                   ],
                   ephemeral: true
               });
               }
               

               


               command.execute(interaction, client)
        }
    }
}