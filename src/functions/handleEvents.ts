import { join } from "path";
import { MyClient } from "..";
import { walkSync } from "./walkSync";

export default (client: MyClient) => {
  return async function handleEvents() {
        for (const file of walkSync(join(import.meta.dir, "../events"))) {
            const event = (await import(file)).default;

            if (event.once) {
                client.once(event.name, (...args: any[]) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args: any[]) => event.execute(...args, client));
            }
        }
    };
}