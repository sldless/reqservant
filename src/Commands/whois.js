const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whois")
    .setDescription("Well, who is it?")
    .addUserOption((user) => {
      return user
        .setName("member")
        .setDescription("I kind of need someone to get info from...");
    }),
  async run(interaction, MessageEmbed) {
    let user = interaction.options.getUser("member");

    if (!user) {
      user = interaction.user;
    }

    const member = interaction.guild.members.cache.get(user.id);

    const colors = ["#2ECC71", "#E91E63", "#3498DB", "#F1C40F"];

    const userEmbed = new MessageEmbed()
      .setColor(
        member.displayHexColor !== "#000000"
          ? member.displayHexColor
          : colors[Math.floor(Math.random() * colors.length)]
      )
      .setAuthor(
        `${user.tag} ( ${
          user.bot ? "is a bot... kinda cringe" : "is an actual person"
        } )`,
        user.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        {
          name: `Join Stats ( click to view more info )`,
          value: `> **Joined**: **<t:${Math.floor(
            member.joinedTimestamp / 1000
          )}:R>**\n> **Created**: **<t:${Math.floor(
            user.createdTimestamp / 1000
          )}:R>**`,
        },
        {
          name: "ID, Nickname, Username, etc...",
          value: `${
            member.nickname
              ? `**Nickname is set to \`${member.nickname}\`**`
              : "**User has no nickname :/**"
          }\n> **Snowflake**: ${user.id}\n> **Username**: ${user.username}`,
        },
        {
          name: `Roles (${
            member.roles.cache.filter((r) => r.id !== "788789142343122945").size
          })`,
          value: `${member.roles.cache
            .filter((r) => r.id !== "788789142343122945")
            .sorted((r1, r2) => r2.position - r1.position)
            .map((r) => r)
            .join(", ")}`,
        }
      );

    interaction.reply({ embeds: [userEmbed] });
  },
};
