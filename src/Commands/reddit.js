const { SlashCommandBuilder } = require("@discordjs/builders");

const snoowrap = require('snoowrap');

const r = new snoowrap({
  userAgent: 'userAgent string',
  clientId: 'YCk6rLfIMMY6R3llJyXeQA',
  clientSecret: 'yYA-ZlctelGQDEwXMxOWQ8w81FiyAA',
  username: 'JustReqDummyAccount',
  password: 'BappyLikesAnimetm'
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reddit")
    .setDescription("Get random r/JustReq posts"),
  async run(interaction, MessageEmbed) {
    if (interaction.user.id === '509509052573810720') {
      let randomPost
      let randomPostAuth

      r.getSubreddit('JustReq').getRandomSubmission().fetch().then(value => {
        randomPost = value

        r.getUser(randomPost.author.name).fetch().then(value => {
          randomPostAuth = value

          const randomPostEmbed = new MessageEmbed()
            .setColor(interaction.guild.members.cache.get(interaction.user.id).displayHexColor)
            .setAuthor(`Post author: ${randomPostAuth.name}`, randomPostAuth.icon_img)
            .setTitle(randomPost.title)
            .setDescription(randomPost.selftext)

          interaction.reply({ embeds: [randomPostEmbed], ephemeral: true })
        })
      })
    }
    else {
      await interaction.reply({ content: `You aren't allowed to use this command. It's only used for testing purposes by server admin.`, ephemeral : true })
    }
  },
};