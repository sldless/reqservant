import { MessageEmbed } from "discord.js";

function randomItem(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

module.exports = {
  name: "guildMemberAdd",
  on: true,
  async execute(member: any) {
    const guild = member.guild;

    const channel = guild.channels.cache.get("876971753144979486");

    const messages = [
      `A wild "**${member.user.username}**" appeared... But where's the pizza?`,
      `New person to ~~bully~~ welcome to our lovely community... oh and their name is **${member.user.username}**.`,
      `Oh quick, order something because dinner's on **${member.user.username}**!`,
      `It's-a-**${member.user.username}**!`,
      `**${member.user.username}** echoes their presence in this server.`,
      `${member.user.username}, welcome to **${guild.name}**! I mean, everyone needs to be greeted someway or another.`,
    ];

    const holaEmbed = new MessageEmbed()
      .setAuthor(
        "Member Joined!",
        "https://cdn.discordapp.com/emojis/882070170607185990.png?v=1"
      )
      .setDescription(randomItem(messages))
      .setFooter(`${guild.memberCount} members exist here!`)
      .setTimestamp()
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setColor("#7DEB58");

    channel.send({ embeds: [holaEmbed] });
  },
};
