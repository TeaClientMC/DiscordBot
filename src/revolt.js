import { Client } from "revolt.js";

  const revoltBot = new Client();
    
    revoltBot.loginBot(process.env.Revolt_Token);
    
    revoltBot.on('ready', () => {
      console.log(`Logged in as ${revoltBot.user.username}`);
    });
    
    revoltBot.on('message', async (message) => {
      if (message.author.bot) return; // Ignore messages from other bots
    
      
    
    
    
    });
    export function sendMessageRevolt() {
      revoltBot.sendMessage({
        channel: '01HAH5W98KFD6SQPP0Y44H5FGA',
        content: content,
      });
    }



    