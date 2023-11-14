import { join } from "path";
import { MyClient, TeaClientGrad } from "..";
import { walkSync } from "./walkSync";
import { AlignmentEnum, AsciiTable3 } from "ascii-table3";


export default (client: MyClient) => {
  return async function handleEvents() {

    var EventTable = new AsciiTable3("Loaded Events")
    .setHeading("Command", "Status")
    .setAlign(3, AlignmentEnum.CENTER)



        for (const file of walkSync(join(import.meta.dir, "../events"))) {
            const event = (await import(file)).default;

            EventTable.addRow(event.name, "loaded")
            EventTable.setStyle('unicode-single');



            if (event.once) {
                client.once(event.name, (...args: any[]) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args: any[]) => event.execute(...args, client));
            }
        }
        console.log(TeaClientGrad(`${EventTable}`))
    };
}