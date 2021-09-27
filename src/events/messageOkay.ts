import { manager } from "../manager";
import { user } from "../database/user";

module.exports = {
  name: "messageCreate",
  async execute(message: any) {
    if (message.author.bot) return;
    const person = await user.findOne({ id: message.author.id });

    if (!person) {
      const newPerson = new user({ id: message.author.id });
      await newPerson.save();

      manager.log(
        `Added ${message.member.displayName} to the database`,
        "success"
      );
      return;
    }
  },
};
