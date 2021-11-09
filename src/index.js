const { token } = require("./config.json");
const { Client, Intents, Collection } = require("discord.js");
const { loadCommands, loadEvents, loadDatabase, } = require("./Utilities/loaders");

globalThis.log = require("./Utilities/logger");
globalThis.client = new Client({
  intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MEMBERS],
  presence: { activities: [{
        name: `Loading...`,
        type: "PLAYING",
      },],status: "dnd",
  },
  allowedMentions: { repliedUser: false }
});
globalThis.commands = new Collection();
globalThis.events = new Collection();
loadCommands();
loadEvents();
loadDatabase();

client.login(token);
