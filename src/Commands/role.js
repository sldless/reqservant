const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Control your announcement roles")
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Obtain an announcement role of your choice')
        .addStringOption(option => option.setName('name').setDescription(`Choose the role you want to have`).setRequired(true)
          .addChoice('Mod Announcements', 'modannouncements')
          .addChoice('Bot Announcements', 'botannouncements')
          .addChoice('New Poll', 'newpoll')
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove an announcement role of your choice')
        .addStringOption(option => option.setName('name').setDescription(`Choose the role you want to remove`).setRequired(true)
          .addChoice('Mod Announcements', 'modannouncements')
          .addChoice('Bot Announcements', 'botannouncements')
          .addChoice('New Poll', 'newpoll')
        )
    ),
  async run(interaction) {
    let user = interaction.user;
    const member = interaction.guild.members.cache.get(user.id);
    const colors = ["#2ECC71", "#E91E63", "#3498DB", "#F1C40F"];

    let commandName = interaction.options.getSubcommand()

    const roleName = interaction.options.getString('name');
    let role

    if (roleName === "modannouncements") {
      role = interaction.guild.roles.cache.find(r => r.id === "788843730093998100");
    } else if (roleName === "botannouncements") {
      role = interaction.guild.roles.cache.find(r => r.id === "884985706081030195");
    } else if (roleName === "newpoll") {
      role = interaction.guild.roles.cache.find(r => r.id === "904491547322646539");
    }

    let embedTitle
    let embedDesc

    if (commandName == "add") {
      if (member.roles.cache.has(role.id)) {
        embedTitle = "You already have that role!"
        embedDesc = "If you want to remove it, use the `/role remove` command."
      }
      else {
        embedTitle = "Role equipped!"
        embedDesc = `You will be notified every time there's a ${role}`
        member.roles.add(role)
      }
    } else if (commandName == "remove") {
      if (!member.roles.cache.has(role.id)) {
        embedTitle = "You don't have that role!"
        embedDesc = "If you want to equip it, use the `/role add` command."
      }
      else {
        embedTitle = "Role removed!"
        embedDesc = `You will no longer be notified of any ${role}`
        member.roles.remove(role)
      }
    }

    const roleEmbed = new MessageEmbed()
      .setColor(
        member.displayHexColor !== "#000000"
          ? member.displayHexColor
          : colors[Math.floor(Math.random() * colors.length)]
      )
      .setTitle(embedTitle)
      .setDescription(embedDesc)

    interaction.reply({ embeds: [roleEmbed], ephemeral: true });
  },
};
