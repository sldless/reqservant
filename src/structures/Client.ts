import { Client, Collection, Intents } from "discord.js";
import { log, customLog } from "./Logger";
import { Loader } from "./Loader";

export class client extends Client {
  keys: { token: string; mongoose: string };
  commands: Collection<string, any>;
  events: Collection<string, any>;
  log: typeof log;
  customLog: typeof customLog;
  loader: Loader;

  constructor(keys: { token: string; mongoose: string }) {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      ],
      presence: {
        activities: [{ name: "the Mario Land Mod", type: "PLAYING" }],
        status: "dnd",
      },
    });

    this.keys = keys;
    this.commands = new Collection();
    this.events = new Collection();
    this.log = log;
    this.customLog = customLog;
    this.loader = new Loader(this);
  }

  start() {
    this.login(this.keys.token);
    this.loader.events();
    this.loader.commands();
    this.loader.database(this.keys.mongoose);
  }
}
