import {
  MessageEmbed,
  GuildMember,
  Role,
  User,
  ColorResolvable,
} from "discord.js";
import { user } from "../database/user";

module.exports = {
  name: "whois",
  description: "Who is it?",
  options: [
    {
      name: "person",
      description: "Who do you wanna check?",
      type: "USER",
    },
  ],
  async execute(interaction: any) {
    let person = interaction.options.getUser("person") as User;

    if (!person) {
      person = interaction.user;
    }

    const fancyPerson = interaction.guild.members.cache.get(
      person.id
    ) as GuildMember;

    const colors = ["#2ECC71", "#E91E63", "#3498DB", "#F1C40F"];

    const personEmbed = new MessageEmbed()
      .setColor(
        fancyPerson.displayHexColor !== "#000000"
          ? fancyPerson.displayHexColor
          : (colors[
              Math.floor(Math.random() * colors.length)
            ] as ColorResolvable)
      )
      .setAuthor(
        `${person.tag} ( ${
          person.bot ? "is a bot... kinda cringe" : "is an actual person"
        } )`,
        person.displayAvatarURL({ dynamic: true })
      ).setThumbnail(person.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        {
          name: `Join Stats ( click to view more info )`,
          value: `> **Joined**: <t:${Math.floor(
            (fancyPerson.joinedTimestamp as number) / 1000
          )}:R>\n> **Created**: <t:${Math.floor(
            (person.createdTimestamp as number) / 1000
          )}:R>`,
        },
        {
          name: "ID, Nickname, Username, etc...",
          value: `${
            fancyPerson.nickname
              ? `**Nickname is set to \`${fancyPerson.nickname}\`**`
              : "**User has no nickname :/**"
          }\n> **Snowflake**: ${person.id}\n> **Username**: ${person.username}`,
        },
        {
          name: `Roles (${
            fancyPerson.roles.cache.filter(
              (r: Role) => r.id !== "788789142343122945"
            ).size
          })`,
          value: `${fancyPerson.roles.cache
            .filter((r: Role) => r.id !== "788789142343122945")
            .sorted((r1: Role, r2: Role) => r2.position - r1.position)
            .map((r: Role) => r)
            .join(", ")}`,
        }
      );

    interaction.reply({ embeds: [personEmbed] });
  },
};
