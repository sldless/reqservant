import { MessageEmbed } from "discord.js";

function randomItem(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

module.exports = {
  name: "guildMemberRemove",
  on: true,
  async execute(member: any) {
    const guild = member.guild;

    const channel = guild.channels.cache.get("876971753144979486");

    const messages = [
      `Welp, ${member.user.username} is gone...`,
      `There goes another ~~victim~~ kind soul who's name was ${member.user.username}...`,
      `The food is getting cold and we are all full, and ${member.user.username} was our only hope!`,
      `*Fwomp* ${member.user.username} ran away because of uhhh... reasons.`,
      `sudo rm -rf /${member.user.username}`,
      `${member} left ${guild.name} :(, but all good things must come to an end.`,
    ];

    const gbyeEmbed = new MessageEmbed()
      .setAuthor(
        "Member left :(",
        "https://cdn.discordapp.com/emojis/844614108989227079.png?v=1"
      )
      .setDescription(randomItem(messages))
      .setFooter(`${guild.memberCount} members remain...`)
      .setTimestamp()
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setColor("#EB5858");

    channel.send({ embeds: [gbyeEmbed] });
  },
};
