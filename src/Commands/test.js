const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder().setName("test").setDescription("a test command"),
  run(interaction) {
    interaction.reply({ content: "test", ephemeral: true })
  }
}