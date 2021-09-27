import { readdirSync } from "fs";
import * as mongoose from "mongoose";
import * as chalk from "chalk";

export class Loader {
  client: any;

  constructor(client: any) {
    this.client = client;
  }

  async database(url: string) {
    await mongoose.connect(url);

    this.client.log(`Connected to MongoDB`, "success");
  }

  async commands() {
    this.client.log(
      `Attempting to load ${chalk.bold(
        readdirSync("./src/commands").length
      )} commands...`,
      "wait"
    );

    let cmd: number = 0;

    for (const file of readdirSync("./src/commands").filter((file) =>
      file.endsWith(".ts")
    )) {
      const command = require(`../commands/${file.slice(0, -3)}`);

      this.client.commands.set(command.name, command);

      try {
        require(`../commands/${file.slice(0, -3)}`);
        this.client.log(
          `${chalk.hex("#E2678A")(command.name)} loaded`,
          "success"
        );
        cmd++;
      } catch (e) {
        this.client.log(
          `${chalk.hex("#E2678A")(command.name)} failed\n   ${e}`,
          "error"
        );
        cmd--;
      }
    }

    this.client.log(
      `Loaded ${chalk.bold(cmd)}/${chalk.bold(
        readdirSync("./src/commands").length
      )} commands`,
      "wait"
    );
  }

  async events() {
    for (const file of readdirSync("./src/events").filter((file) =>
      file.endsWith(".ts")
    )) {
      const event = require(`../events/${file.slice(0, -3)}`);

      if (event.once) {
        this.client.once(event.name, async (...args: string[]) =>
          event.execute(...args)
        );
      } else {
        this.client.on(event.name, async (...args: string[]) =>
          event.execute(...args)
        );
      }
      this.client.events.set(event.name, event);
    }
  }
}
