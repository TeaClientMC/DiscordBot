import { join } from "path";
import { MyClient } from "..";
import { walkSync } from "./walkSync";
import { Routes } from "discord.js";

export default (client: MyClient) => {
  return async function handleCommands() {
        for (const file of walkSync(join(import.meta.dir, "../commands"))) {
            if (!file.endsWith(".ts")) continue
            const command = (await import(file)).default;
            if (client.commands.get(command.data.name)) continue;
            if (command.disabled) continue;

            client.commands.set(command.data.name, command);
            client.commandArray.push(command.data.toJSON());
        }

        await client.rest.put(
            Routes.applicationCommands(client.user!.id), {
                body: client.commandArray
            },
        );
    };
}