const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  MessageEmbed,
  MessageButton,
  MessageSelectMenu,
  MessageActionRow,
  InteractionCollector,
} = require("discord.js");
const tag = require("../Database/tag");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tag")
    .setDescription("Tags I guess")
    .addSubcommand((sub) => {
      return sub
        .setName("create")
        .setDescription("Creates a tag I guess")
        .addStringOption((t) => {
          return t
            .setName("title")
            .setDescription("It kinda needs a title")
            .setRequired(true);
        })
        .addStringOption((d) => {
          return d
            .setName("content")
            .setDescription("It can't be empty... or can it?")
            .setRequired(true);
        });
    })
    .addSubcommand((sub) => {
      return sub
        .setName("info")
        .setDescription("Gets info on a tag")
        .addStringOption((t) => {
          return t.setName("tag").setDescription("What's the tag?");
        });
    })
    .addSubcommand((sub) => {
      return sub
        .setName("delete")
        .setDescription("Deletes a tag I guess")
        .addStringOption((t) => {
          return t.setName("tag").setDescription("What's the tag?");
        });
    })
    .addSubcommand((sub) => {
      return sub
        .setName("edit")
        .setDescription("Edits a tag I guess")
        .addStringOption((t) => {
          return t.setName("tag").setDescription("What's the tag?");
        })
        .addStringOption((d) => {
          return d.setName("title").setDescription("New title?");
        })
        .addStringOption((d) => {
          return d.setName("content").setDescription("New content?");
        });
    }),

  async run(interaction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "create":
        if (!interaction.member.roles.cache.has("887429367544815696")) {
          return interaction.reply({
            content: "You need to be a staff member to use this!",
            ephemeral: true,
          });
        }

        const title = interaction.options.getString("title");
        const content = interaction.options.getString("content");

        const document = await tag.findOne({ name: title.toLowerCase() });

        if (document) {
          const errorEmbedOne = new MessageEmbed()
            .setAuthor("This tag already exists")
            .setDescription(
              `\`${title}\` is already in the database. You can overwrite it.\n\nWould you like to overwrite the tag?`
            )
            .setFooter("You have 15 seconds")
            .setColor("#E91E63");

          const errorActionRowOne = new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId("yes")
              .setLabel("✓")
              .setStyle("SUCCESS"),
            new MessageButton()
              .setCustomId("no")
              .setLabel("✘")
              .setStyle("DANGER")
          );

          interaction.reply({
            embeds: [errorEmbedOne],
            components: [errorActionRowOne],
          });

          const message = interaction.fetchReply();

          const collector = new InteractionCollector(interaction.client, {
            channel: interaction.channelId,
            componentType: "BUTTON",
            message: message.id,
          });

          collector.on("collect", async (c) => {
            if (c.user.id !== interaction.user.id) {
              c.reply({ content: "You can't do that!" });
            }

            if (c.customId === "yes") {
              await tag.findOneAndUpdate(
                { name: title.toLowerCase() },
                {
                  name: title.toLowerCase(),
                  content: content,
                  author: interaction.user.id,
                  created: Date.now(),
                }
              );
              return interaction.editReply({
                embeds: [],
                components: [],
                content: "Tag updated",
              });
            } else if (c.customId === "no") {
              return interaction.editReply({
                embeds: [],
                components: [],
                content: "Tag not updated",
              });
            }
          });
          return;
        }

        const doc = new tag({
          id: Math.ceil(Math.random() * Date.now() * 5).toString(36),
          name: title.toLowerCase(),
          content: content,
          author: interaction.user.id,
          created: Date.now(),
          uses: 0,
        });

        await doc.save();

        interaction.reply({
          content: "Tag created",
          ephemeral: true,
        });
        break;

      case "info":
        if (!interaction.member.roles.cache.has("887429367544815696")) {
          return interaction.reply({
            content: "You need to be a staff member to use this!",
            ephemeral: true,
          });
        }

        const tagThingy = interaction.options.getString("tag");

        let documen2;

        if (tagThingy) {
          documen2 = await tag.findOne({ name: tagThingy.toLowerCase() });
        }

        const tags = await tag.find();

        let input;

        if (!tagThingy || !documen2) {
          const errorEmbedOne = new MessageEmbed()
            .setAuthor("Specified Tag doesn't exist.")
            .setDescription(
              `The tag doesn't exist, but these ones do.\n\`\`\`\n${
                tags.length > 0 ? tags.map((t) => t.name) : "No tags yet"
              }\`\`\``
            )
            .setColor("#3498DB");

          const errorActionRowTwo = new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId("nopers")
              .setLabel("✘")
              .setStyle("DANGER"),
          );

          interaction.reply({
            embeds: [errorEmbedOne],
            components: [errorActionRowTwo],
          });

          input = new InteractionCollector(interaction.client, {
            channel: interaction.channelId,
            componentType: "TEXT_INPUT",
            message: interaction.fetchReply().id,
          });

          return;
        }

        const infoEmbed = new MessageEmbed()
          .setAuthor(documen2.name)
          .setDescription(
            `> **Author**: <@${
              documen2.author
            }>\n> **Created**: **<t:${Math.floor(
              parseInt(documen2.created) / 1000
            )}:R>**\n> **Uses**: **${documen2.uses}**`
          )
          .setColor("#3498DB");

        interaction.reply({
          embeds: [infoEmbed],
        });
        break;
    }
  },
};
