import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, Colors } from "discord.js"
import { MyClient } from "..";
import packageJson from "../../package.json"
import { stripIndents } from "common-tags"


export default {
    data: new SlashCommandBuilder()
      .setName("info")
      .setDescription("Provides information on a selected topic")
      .addStringOption(option => option
        .setName("topic")
        .setDescription("Select a topic")
        .setChoices(
          { name: 'Discord Bot', value: 'bot' },
          { name: 'Discord Server', value: 'server' },
          { name: 'Commands', value: 'commands' },
          { name: 'Fun', value: 'fun' }
        )
        .setRequired(true)
      ),
    emoji: '🤓',
    async execute(interaction: ChatInputCommandInteraction, client: MyClient) {
      if (!interaction.inCachedGuild()) return

      const options = interaction.options;
      const choice = options.getString('topic');
      switch (choice) {
        case "bot": {

          const dependencies = packageJson.dependencies as Record<string, string>;
          
          const formatVersion = (version: string) => version.replace(/\^/g, ' v').replace(/['"]/g, '');

          // Replace ^ with @ and remove ' and " from dependency versions
          const updatedDependencies = Object.keys(dependencies).reduce((acc: string[], key) => {
            const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
            acc.push(`> ${capitalizedKey}:${formatVersion(dependencies[key])}`);
            return acc;
          }, []); 
         
          const updatedDependenciesString = updatedDependencies.join(",\n");
          
          // Remove trailing comma
          const formattedDependenciesString = updatedDependenciesString.replace(/,\n$/, '');
          
          // Embed
          const embed = new EmbedBuilder()
            .setTitle(`**TeaClient Info:**`)
            .setColor(Colors.White)
            .setThumbnail(client.user!.avatarURL())
            .setDescription(stripIndents`
              ### Language:
              > Made in TypeScript v${formatVersion(packageJson.peerDependencies.typescript)}
              ### Dependencies:
              > Bun:${Bun.version}
              ${formattedDependenciesString}
              ### Bot Overview:
              > Moderation bot/leveling for TeaClient named: TeaClient Core!
            `);

          interaction.reply({ embeds: [embed], ephemeral: true });
          break;
        }
        case "server": {
          const guild = interaction.guild;
          await guild.members.fetch()
          const guildMemberCount = guild.memberCount
          const guildBotCount = guild.members.cache.filter(member => member.user.bot).size;
          const guildChannelCount = guild.channels.cache.size;

          const embed = new EmbedBuilder()
            .setTitle(`** TeaClient Server Info**`)
            .setColor(Colors.White)
            .setThumbnail(client.user!.avatarURL())
            .setDescription(stripIndents`

              **Stats**
              > 🤖 Bots: ${guildBotCount.toLocaleString()}
              > 🙋‍♂️ Members: ${(guildMemberCount - guildBotCount).toLocaleString()}
              > 📃 Channels: ${guildChannelCount.toLocaleString()}
              > 👑 Server Owner: <@${guild.ownerId}>
              > 💻 Server Id: \`${guild.id}\`
              > 📌 Server Rules: <#${guild.rulesChannelId}>
            `);

          interaction.reply({ embeds: [embed], ephemeral: true });
          break;
        }
        case "commands": {
          let commands = ``;
          client.commands.forEach(command => {
            let emoji = command.emoji?command.emoji:'❓';
            commands += `> ${emoji} **/${command.data.name}** - ${command.data.description}\n`
          });

          const embed = new EmbedBuilder()
            .setTitle(`**Cordevall Bot Commands**`)
            .setColor(0xffff00)
            .setFooter({
              text: "Cordevall - https://github.com/Cordevall",
              iconURL: "https://avatars.githubusercontent.com/u/143160364?s=200&v=4"
            })
            .setDescription(`

              **Commands**
              ${commands}
            `);

          interaction.reply({ embeds: [embed], ephemeral: true });
          break;
        }
        case "fun": {

          break;
        }
      }
    }
}