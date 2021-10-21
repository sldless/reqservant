const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { token, botId, guildId } = require("../config.json");
const fs = require("fs");

module.exports = {
  name: "ready",
  once: true,
  async run() {
    const botCommands = [];
    const commandFiles = fs
      .readdirSync("./src/Commands")
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`../Commands/${file}`);
      botCommands.push(command.data.toJSON());
      commands.set(command.data.name, command);
    }

    const rest = new REST({ version: "9" }).setToken(token);

    try {
      log("Starting to reload commands", "wait");

      await rest.put(Routes.applicationGuildCommands(botId, guildId), {
        body: botCommands,
      });

      log("Successfully reloaded commands", "wait");
    } catch (error) {
      log(error, "error");
    }

    log("Connected to Discord", "success");

    client.user.setPresence({ activities: [{ name: `with ${commands.size === 1 ? `${commands.size} command` : `${commands.size} commands`}`, type: "PLAYING" }], status: "online" })
  },
};
