const { WebhookClient } = require("discord.js")

module.exports = {
  name: "interactionCreate",
  async run(interaction) {
    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.run(interaction);
    } catch (error) {
      const errorWebhook = new WebhookClient({ url: "https://canary.discord.com/api/webhooks/898019926663655424/g2H-loX32vYWXp4tz-ILZMA8l4IDPEhaHST3zIBvOgRqzfKqTgzlhYOlotRb08O0NtK7" })

      await errorWebhook.send({ content: `||<@509509052573810720>|| \`${error}\` <t:${Math.floor(Date.now() / 1000)}:R>\n\`\`\`diff\n- Command: ${interaction.commandName}\n- Username: ${interaction.user.username}\n- Channel: ${interaction.channel.name}\`\`\`` })

      interaction.reply({
        content: "I found an error, I will let the developer know.",
        ephemeral: true,
      });

      log(error, "error");
    }
  },
};
