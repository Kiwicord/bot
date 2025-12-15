import {
  PermissionsBitField,
  type ChatInputCommandInteraction,
  ApplicationCommandOptionType,
} from "discord.js";

export default {
  name: "kick",
  description: "Kickt einen User vom Server",
  permissions: PermissionsBitField.Flags.KickMembers,
  options: [
    {
      name: "user",
      description: "Der User, der gekickt werden soll",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "Grund für den Kick",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],

  callback: async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guild) return;

    const user = interaction.options.get("user")?.user;
    const reason =
      interaction.options.get("reason")?.value?.toString() ??
      "Kein Grund angegeben";

    if (!user) return;

    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "❌ User nicht gefunden.",
        ephemeral: true,
      });
    }

    if (!member.kickable) {
      return interaction.reply({
        content: "❌ Ich kann diesen User nicht kicken (Rolle zu hoch?).",
        ephemeral: true,
      });
    }

    await interaction.reply(
      `👢 **<@${user.id}>** wurde vom Server gekickt.\n📝 Grund: ${reason}`
    );

    await member.kick(reason);
  },
};
