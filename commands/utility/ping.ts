import type { CommandInteraction } from "discord.js";

export default {
  name: "Ping",
  description: "Replies with Pong",
  callback: async (interaction: CommandInteraction) => {
    await interaction.reply({
      content: "Pong",
    });
  },
} as Command;
