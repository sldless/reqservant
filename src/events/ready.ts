import { manager } from "../manager";

module.exports = {
  name: "ready",
  once: true,
  async execute() {
    manager.guilds.cache.map(async (guild) => {
      const data: any = [];

      manager.commands.map(async (slash) => {
        data.push({
          name: slash.name,
          description: slash.description,
          options: slash.options,
        });
      });

      await guild.commands.set(data);
    });

    manager.log("Successfully connected to Discord", "success");
  },
};
