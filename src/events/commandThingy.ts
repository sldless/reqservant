import { MessageEmbed } from "discord.js";
import { manager } from "../manager";

module.exports = {
  name: "interactionCreate",
  on: true,
  async execute(interaction: any) {
    if (!interaction.isCommand()) return;

    if (!manager.commands.has(interaction.commandName)) return;

    const fancyEmbedShit = new MessageEmbed()
      .setColor("#dd403a")
      .setTitle("Whoops I found an error!");

    try {
      await manager.commands.get(interaction.commandName).execute(interaction);
      manager.log(
        `${interaction.commandName} was successfully ran...`,
        "success"
      );
    } catch (error) {
      fancyEmbedShit.setDescription(
        `So I found an error, let Bappy know so he can fix it I guess.\n\`\`\`ts\n${error}\`\`\``
      );
      console.error(error);
      interaction.reply(interaction, {
        content: "Oops something went wrong!",
        ephemeral: true,
      });
    }
  },
};
