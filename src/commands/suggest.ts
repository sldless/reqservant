import {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  TextChannel,
  InteractionCollector,
  ButtonInteraction,
} from "discord.js";
import { manager } from "../manager";
import { suggestion } from "../database/suggestion";

const rand = function () {
  return Math.random().toString(36).substr(2);
};

const token = function () {
  return rand() + rand();
};

module.exports = {
  name: "suggest",
  description: "Suggest a mod or a change to the server!",
  options: [
    {
      name: "type",
      description: "The type of suggestion",
      required: true,
      type: "STRING",
      choices: [
        {
          name: "mod",
          value: "mod",
        },
        {
          name: "server",
          value: "server",
        },
      ],
    },
    {
      name: "content",
      description: "The content of the suggestion",
      required: true,
      type: "STRING",
    },
  ],
  async execute(interaction: any) {
    const content = interaction.options.getString("content");
    const type = interaction.options.getString("type");

    let votes: Number = 0;

    const channels = {
      mod: interaction.guild.channels.cache.get(
        "876523526692155432"
      ) as TextChannel,
      server: interaction.guild.channels.cache.get(
        "855560283883044864"
      ) as TextChannel,
      review: interaction.guild.channels.cache.get(
        "883165505437958155"
      ) as TextChannel,
      discussion: interaction.guild.channels.cache.get(
        "883063117540646945"
      ) as TextChannel,
    };

    const buttonThingsStage1 = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("SUCCESS")
        .setCustomId("approve")
        .setEmoji("<:upvote:879912214138617866>"),
      new MessageButton()
        .setStyle("DANGER")
        .setCustomId("deny")
        .setEmoji("<:downvote:879912233507889163>")
    );

    const buttonThingsStage2 = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("SUCCESS")
        .setCustomId("yay")
        .setEmoji("<:upvote:879912214138617866>"),
      new MessageButton()
        .setStyle("DANGER")
        .setCustomId("nah")
        .setEmoji("<:downvote:879912233507889163>")
    );

    const modEmbed = new MessageEmbed()
      .setColor("#1F909C")
      .setTitle("Mod Suggestion")
      .setDescription(`> ${content}`)
      .addField(
        `• Stats`,
        `> **Suggested by**: ${interaction.user}\n> **Total Votes**: \`${votes}\``
      )
      .setTimestamp();

    const serverEmbed = new MessageEmbed()
      .setColor("#E79E0C")
      .setTitle("Server Suggestion")
      .setDescription(`> ${content}`)
      .addField(
        `• Stats`,
        `> **Suggested by**: ${interaction.user}\n> **Total Votes**: \`${votes}\``
      )
      .setTimestamp();

    const approvalEmbed = new MessageEmbed()
      .setColor("#D53A31")
      .setTitle("Suggestion Awaiting Approval")
      .setDescription(`> **Suggestion**: ${content}`)
      .addField(
        `• Stats`,
        `> **Suggested by**: ${interaction.user}\n> **Suggestion type**: \`${type}\``
      )
      .setTimestamp();

    const approvalMessage = await channels.review.send({
      embeds: [approvalEmbed],
      components: [buttonThingsStage1],
    });

    channels.discussion.send({
      content: `${interaction.user}'s suggestion was successfully submitted, with the type of \`${type}\``,
    });

    const approvalCollector = new InteractionCollector(manager, {
      channel: channels.review,
      componentType: "BUTTON",
      message: approvalMessage,
      maxUsers: 1,
    });

    approvalCollector.on("collect", async (c: ButtonInteraction) => {
      if (c.customId === "approve") {
        approvalMessage.edit({
          embeds: [
            approvalEmbed.setTitle("Approved Suggestion").setColor("#25BA72"),
          ],
          components: [],
        });

        const sug = new suggestion({
          author: interaction.user.id,
          votes: 0,
          votedUsers: [],
          type,
          id: token(),
        });

        await sug.save();
        const find = await suggestion.findOne({ id: sug.id });

        if (type === "mod") {
          const modMessage = await channels.mod.send({
            embeds: [modEmbed],
            components: [buttonThingsStage2],
          });

          const modVoteCollector = new InteractionCollector(manager, {
            channel: channels.mod,
            componentType: "BUTTON",
            message: modMessage,
          });

          modVoteCollector.on("collect", async (m: ButtonInteraction) => {
            if (
              m.customId === "yay" &&
              !find.votedUsers.find((v: any) => v.id === m.user.id)
            ) {
              find.votes++;
              find.votedUsers.push({ id: m.user.id, type: "upvote" });

              await find.save();

              votes = find.votes;

              m.deferUpdate();

              modMessage.edit({
                embeds: [
                  modEmbed.setFields({
                    name: `• Stats`,
                    value: `> **Suggested by**: ${interaction.user}\n> **Total Votes**: \`${votes}\``,
                  }),
                ],
                components: [buttonThingsStage2],
              });
            } else if (
              m.customId === "nah" &&
              !find.votedUsers.find((v: any) => v.id === m.user.id)
            ) {
              find.votes--;
              find.votedUsers.push({ id: m.user.id, type: "downvote" });

              await find.save();

              votes = find.votes;

              m.deferUpdate();

              modMessage.edit({
                embeds: [
                  modEmbed.setFields({
                    name: `• Stats`,
                    value: `> **Suggested by**: ${interaction.user}\n> **Total Votes**: \`${votes}\``,
                  }),
                ],
                components: [buttonThingsStage2],
              });
            } else {
              m.reply({ content: "You have already voted", ephemeral: true });
            }
          });
        } else if (type === "server") {
          const serverMessage = await channels.server.send({
            embeds: [serverEmbed],
            components: [buttonThingsStage2],
          });

          const serverVoteCollector = new InteractionCollector(manager, {
            channel: channels.server,
            componentType: "BUTTON",
            message: serverMessage,
          });

          serverVoteCollector.on("collect", async (m: ButtonInteraction) => {
            if (
              m.customId === "yay" &&
              !find.votedUsers.find((v: any) => v.id === m.user.id)
            ) {
              find.votes++;
              find.votedUsers.push({ id: m.user.id, type: "upvote" });

              await find.save();

              votes = find.votes;

              m.deferUpdate();

              serverMessage.edit({
                embeds: [
                  serverEmbed.setFields({
                    name: `• Stats`,
                    value: `> **Suggested by**: ${interaction.user}\n> **Total Votes**: \`${votes}\``,
                  }),
                ],
                components: [buttonThingsStage2],
              });
            } else if (
              m.customId === "nah" &&
              !find.votedUsers.find((v: any) => v.id === m.user.id)
            ) {
              find.votes--;
              find.votedUsers.push({ id: m.user.id, type: "downvote" });

              await find.save();

              votes = find.votes;

              m.deferUpdate();

              serverMessage.edit({
                embeds: [
                  serverEmbed.setFields({
                    name: `• Stats`,
                    value: `> **Suggested by**: ${interaction.user}\n> **Total Votes**: \`${votes}\``,
                  }),
                ],
                components: [buttonThingsStage2],
              });
            } else {
              m.reply({ content: "You have already voted", ephemeral: true });
            }
          });
        }

        channels.discussion.send({
          content: `${interaction.user}'s suggestion was approved!`,
        });
      } else if (c.customId === "deny") {
        if (type === "mod") {
          approvalMessage.edit({
            embeds: [
              approvalEmbed.setTitle("Denied Suggestion").setColor("#ba2525"),
            ],
            components: [],
          });
          channels.discussion.send({
            content: `${interaction.user}'s suggestion was denied :(`,
          });
        }
      }
    });

    interaction.reply({
      content: "Suggestion was sent successfully!",
      ephemeral: true,
    });
  },
};
