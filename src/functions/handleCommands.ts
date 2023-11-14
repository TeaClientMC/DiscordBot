import { join } from "path";
import { MyClient, TeaClientGrad } from "..";
import { walkSync } from "./walkSync";
import { Routes } from "discord.js";
import { AlignmentEnum, AsciiTable3 } from "ascii-table3";


export default (client: MyClient) => {

    const commandTable = new AsciiTable3("Loaded Commands")
    .setHeading("Command", "Status")
    .setAlign(3, AlignmentEnum.CENTER)

  return async function handleCommands() {
        for (const file of walkSync(join(import.meta.dir, "../commands"))) {
            if (!file.endsWith(".ts")) continue
            const command = (await import(file)).default;
            if (client.commands.get(command.data.name)) continue;
            if (command.disabled) continue;

            const status = command.data.description ? "Loaded" : "Not Loaded"; 
            commandTable.addRow(command.data.name, status)
            commandTable.setStyle('unicode-single');

            client.commands.set(command.data.name, command);
            client.commandArray.push(command.data.toJSON());
        }

    

        console.log(TeaClientGrad(`${commandTable}`))

        await client.rest.put(
            Routes.applicationCommands(client.user!.id), {
                body: client.commandArray
            },
        );

        
    };
}