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

    this.client.log(`Successfully connected to MongoDB at ${url}`, "success");
  }

  async commands() {
    for (const file of readdirSync("./src/commands").filter((file) =>
      file.endsWith(".ts")
    )) {
      const command = require(`../commands/${file.slice(0, -3)}`);

      this.client.commands.set(command.name, command);
    }

    this.client.log(
      `Successfully loaded ${chalk.bold(
        readdirSync("./src/commands").length
      )} commands`,
      "success"
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

    this.client.log(
      `Successfully loaded ${chalk.bold(
        readdirSync("./src/events").length
      )} events`,
      "success"
    );
  }
}
