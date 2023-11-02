import { ChatInputCommandInteraction } from "discord.js";
import { MyClient } from "..";

export default {
    name: 'interactionCreate',
    async execute(interaction: ChatInputCommandInteraction, client: MyClient) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return
        
        try{
            await command.execute(interaction, client);
        } catch (error) {
            console.log(error);
            await interaction.reply({
                content: 'There was an error while executing this command!', 
                ephemeral: true
            });
        } 
    },
    
    
      // ----------






}