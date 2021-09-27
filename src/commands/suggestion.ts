import { MessageEmbed, TextChannel } from "discord.js";
import { suggestion } from "../database/suggestion";
import { manager } from "../manager";
import * as chalk from "chalk";

function generateToken() {
  return (Math.random() + 1).toString(36).substring(2, 8);
}

module.exports = {
  name: "suggestion",
  description: "Manage or create a suggestion",
  options: [
    {
      name: "create",
      description: "[ PUBLIC ] Creates a new suggestion based on your input.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "type",
          description: "So what thing do you wanna suggest?",
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
          description: "So now, what would you like to suggest?",
          required: true,
          type: "STRING",
        },
        {
          name: "image",
          description: "[ OPTIONAL ] You want an image too?",
          type: "STRING",
        },
      ],
    },

    {
      name: "delete",
      description: "[ PUBLIC ] Deletes the suggestion based on your input",
      type: "SUB_COMMAND",
      options: [
        {
          name: "id",
          description: "What suggestion would you like to delete?",
          required: true,
          type: "STRING",
        },
      ],
    },

    {
      name: "review",
      description:
        "[ STAFF ] Allows you to review the suggestion for approval/denial",
      type: "SUB_COMMAND",
      options: [
        {
          name: "id",
          description: "What suggestion would you like to review?",
          required: true,
          type: "STRING",
        },
        {
          name: "action",
          description:
            "What action would you like to inflict upon this suggestion?",
          required: true,
          type: "STRING",
          choices: [
            {
              name: "approve",
              value: "approve",
            },
            {
              name: "deny",
              value: "deny",
            },
          ],
        },
        {
          name: "reason",
          description:
            "[ OPTIONAL ( DENIAL ONLY ) ] Why did you pick this action?",
          type: "STRING",
        },
      ],
    },
  ],
  async execute(interaction: any) {
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

    const suggestionEmbed = new MessageEmbed();

    switch (interaction.options.getSubcommand()) {
      case "create": {
        const content = interaction.options.getString("content");
        const type = interaction.options.getString("type");
        const image = interaction.options.getString("image");

        if (image) {
          suggestionEmbed.setImage(image);
        }

        const token = generateToken().toString();

        const mes = await channels.review.send({
          embeds: [
            suggestionEmbed
              .setTitle("Suggestion Awaiting Approval")
              .setColor("#F6A000")
              .addField(
                `• Information`,
                `> Type: \`${type}\`\n> ID: \`${token}\`\n> Author: ${interaction.user}`
              )
              .setDescription(`> ${content}`)
              .setTimestamp(),
          ],
        });

        const document = new suggestion({
          author: interaction.user.id,
          type,
          id: token,
          content,
          message: mes.id,
          image: image ? image : "no image",
          status: "under review",
        });

        await document.save();

        manager.log(
          `Suggestion submitted by ${chalk.bold(
            interaction.member.displayName
          )} ( ${type}, ${token} )`,
          "wait"
        );

        channels.discussion.send({
          content: `**${interaction.member.displayName}**'s suggestion was successfully submitted ( \`${type}\`, \`${token}\` )`,
        });

        interaction.reply({
          content: "Suggestion was sent successfully!",
          ephemeral: true,
        });
        break;
      }

      case "delete": {
        const id = interaction.options.getString("id");

        const idFinder = await suggestion.findOne({
          id: id,
          author: interaction.user.id,
        });

        if (!idFinder) {
          interaction.reply({
            content:
              "I couldn't find a suggestion with that ID or that you own.",
            ephemeral: true,
          });

          manager.log(
            `Suggestion ${chalk.bold(
              id
            )} couldn't be found, or the author doesn't own it.`,
            "error"
          );
          return;
        }

        try {
          if (idFinder.type === "server") {
            channels.server.messages
              .fetch(idFinder.message)
              .then((m: any) => m.delete());
          } else {
            channels.mod.messages
              .fetch(idFinder.message)
              .then((m: any) => m.delete());
          }
        } catch (e: any) {
          interaction.reply(e);
          manager.log(e, "error");
        }

        channels.discussion.send({
          content: `**${interaction.member.displayName}**'s suggestion was successfully deleted ( \`${idFinder.id}\` )`,
        });

        await suggestion.findOneAndRemove({
          id: id,
          author: interaction.user.id,
        });

        manager.log(
          `Suggestion ( ${chalk.bold(idFinder.id)} ) was deleted`,
          "wait"
        );

        interaction.reply({
          content: "Suggestion was successfully deleted!",
          ephemeral: true,
        });
        break;
      }

      case "review": {
        const id = interaction.options.getString("id");
        const action = interaction.options.getString("action");
        const reason = interaction.options.getString("reason");

        if (!interaction.member.roles.cache.get("887429367544815696")) {
          return interaction.reply({
            content: "You can't review a suggestion.",
            ephemeral: true,
          });
        }

        const idFinder = await suggestion.findOne({
          id: id,
        });

        if (idFinder.status === "approved" || idFinder.status === "denied") {
          return interaction.reply({
            content:
              "You can't review a suggestion that has already been reviewed.",
            ephemeral: true,
          });
        }

        switch (action) {
          case "approve": {
            (await channels.review.messages.fetch(idFinder.message)).edit({
              embeds: [
                suggestionEmbed
                  .setTitle("Approved Suggestion")
                  .setColor("#2DCA70")
                  .setFields({
                    name: `• Information`,
                    value: `> ID: \`${id}\`\n> Author: ${interaction.user}`,
                  })
                  .setDescription(`> ${idFinder.content}`)
                  .setTimestamp(),
              ],
            });

            idFinder.status = "approved";
            await idFinder.save();

            switch (idFinder.type) {
              case "server": {
                const sm = await channels.server.send({
                  embeds: [
                    suggestionEmbed
                      .setTitle("Server Suggestion")
                      .setColor("#F1C40F")
                      .setFields({
                        name: `• Information`,
                        value: `> ID: \`${id}\`\n> Author: ${interaction.user}`,
                      })
                      .setDescription(`> ${idFinder.content}`)
                      .setTimestamp(),
                  ],
                });

                idFinder.message = sm.id;
                await idFinder.save();

                await sm.react("<:upvote:879912214138617866>");
                await sm.react("<:downvote:879912233507889163>");
                break;
              }

              case "mod":
                {
                  const sm = await channels.server.send({
                    embeds: [
                      suggestionEmbed
                        .setTitle("Mod Suggestion")
                        .setColor("#3595D6")
                        .setFields({
                          name: `• Information`,
                          value: `> ID: \`${id}\`\n> Author: ${interaction.user}`,
                        })
                        .setDescription(`> ${idFinder.content}`)
                        .setTimestamp(),
                    ],
                  });

                  idFinder.message = sm.id;
                  await idFinder.save();

                  await sm.react("<:upvote:879912214138617866>");
                  await sm.react("<:downvote:879912233507889163>");
                }
                break;
            }

            channels.discussion.send({
              content: `**${interaction.member.displayName}**'s suggestion was approved ( \`${idFinder.id}\` )!`,
            });

            manager.log(
              `Suggestion ( ${chalk.bold(idFinder.id)} ) was approved`,
              "success"
            );

            interaction.reply({
              content: "Suggestion was successfully approved",
              ephemeral: true,
            });
            break;
          }

          case "deny": {
            (await channels.review.messages.fetch(idFinder.message)).edit({
              embeds: [
                suggestionEmbed
                  .setTitle("Denied Suggestion")
                  .setColor("#E91E63")
                  .setFields({
                    name: `• Information`,
                    value: `> ID: \`${idFinder.token}\`\n> Author: ${interaction.user}`,
                  })
                  .setDescription(`> ${idFinder.content}`)
                  .setTimestamp(),
              ],
            });

            idFinder.status = "denied";
            await idFinder.save();

            const stupidArray = [];

            if (reason) {
              stupidArray.push(`for \`${reason}\``);
            }

            channels.discussion.send({
              content: `**${
                interaction.member.displayName
              }**'s suggestion was denied ${stupidArray.join()} ( \`${
                idFinder.id
              }\` )!`,
            });

            manager.log(
              `Suggestion ( ${chalk.bold(
                idFinder.id
              )} ) was denied for ${chalk.bold(stupidArray.join())}`,
              "error"
            );

            await suggestion.findOneAndRemove({
              id: id,
            });

            interaction.reply({
              content: "Suggestion was successfully denied",
              ephemeral: true,
            });
          }
        }
      }
    }
  },
};
