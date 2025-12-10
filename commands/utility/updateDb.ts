import { CommandInteraction, PermissionsBitField } from "discord.js";
import User from "../../db/schema/User.js";

export default {
  name: "updatedb",
  description: "Updated felder in der db",
  permissions: PermissionsBitField.Flags.Administrator,
  callback: async (interaction: CommandInteraction) => {
    await User.updateMany(
      { inventory: { $exists: false } },
      { $set: { inventory: [] } }
    );
    await interaction.reply({ content: "db updated" });
  },
} as ICommand;
