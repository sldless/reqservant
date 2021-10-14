const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, botId, guildId } = require('../config.json');
const { WebhookClient } = require("discord.js")
const fs = require('fs');

module.exports = {
  name: "ready",
  once: true,
  async run() {
    const botCommands = [];
    const commandFiles = fs.readdirSync('./src/Commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`../Commands/${file}`);
      botCommands.push(command.data.toJSON());
      commands.set(command.data.name, command);
    }

    const rest = new REST({ version: '9' }).setToken(token);
    
    try {
      log('Starting to reload commands', "wait");
  
      await rest.put(
        Routes.applicationGuildCommands(botId, guildId),
        { body: botCommands },
      );
  
      log('Successfully reloaded commands', "wait");
    } catch (error) {
      log(error, "error")
    }

    const onlineWebhook = new WebhookClient({ url: "https://canary.discord.com/api/webhooks/898031843713118229/_MWWgP6yLWhj9Zb8p6vXYx2lirtW46tt_cyNUVU1H2eMxOqYvYdE3O_FaBKN4b97zsgz" })
    await onlineWebhook.send({ content: `<:plus:882070170607185990> \`Status: Online\` <t:${Math.floor(Date.now() / 1000)}:R>` })

    log("Connected to Discord", "success")
  }
}