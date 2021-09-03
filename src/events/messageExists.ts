import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

module.exports = {
  name: "messageCreate",
  on: true,
  async execute(message: any) {
    if (message.author.bot) return;

    if (
      message.channel.id == "855560283883044864" ||
      message.channel.id == "876523526692155432"
    ) {
      if (message.content.startsWith("Suggestion: ")) {
        let votes = 0;

        const embed = new MessageEmbed()
          .setTitle("New Suggestion!")
          .setDescription(`> ` + message.content.replace("Suggestion: ", ""))
          .addField(
            `• Stats`,
            `> **Suggested by**: ${message.author}\n> **Total Votes**: \`${votes}\``
          )
          .setColor("#FDA501")
          .setFooter(message.author.id)
          .setTimestamp();

        const buttonThings = new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("SUCCESS")
            .setCustomId("yay")
            .setEmoji("<:upvote:879912214138617866>"),
          new MessageButton()
            .setCustomId("delete")
            .setEmoji("❌")
            .setStyle("SECONDARY"),
          new MessageButton()
            .setStyle("DANGER")
            .setCustomId("nah")
            .setEmoji("<:downvote:879912233507889163>")
        );

        message.delete();
        const pogMessage = await message.channel.send({
          embeds: [embed],
          components: [buttonThings],
        });

        const collector = pogMessage.createMessageComponentCollector({
          componentType: "BUTTON",
        });

        collector.on("collect", async (collected: any) => {
          if (collected.component.customId == "yay") {
            message.channel.send(
              `> **${collected.author.username}** voted **${collected.emoji.name}**`
            );
          } else if (collected.component.customId == "nah") {
            message.channel.send(
              `> **${collected.author.username}** downvoted **${collected.emoji.name}**`
            );
          } else if (collected.component.customId == "delete") {
            if (collected.author.id !== embed.footer) return;
            pogMessage.delete();
          }
        });
      }
    }
  },
};
