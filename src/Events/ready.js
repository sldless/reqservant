const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, botId, guildId } = require('../config.json');
const { WebhookClient } = require("discord.js")
const fs = require('fs');

const snoowrap = require('snoowrap');

const r = new snoowrap({
  userAgent: 'userAgent string',
  clientId: 'YCk6rLfIMMY6R3llJyXeQA',
  clientSecret: 'yYA-ZlctelGQDEwXMxOWQ8w81FiyAA',
  username: 'JustReqDummyAccount',
  password: 'BappyLikesAnimetm'
});

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

    log("Connected to Discord", "success")
  }
}