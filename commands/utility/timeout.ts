import {
  PermissionsBitField,
  type ChatInputCommandInteraction,
  ApplicationCommandOptionType,
} from "discord.js";

export default {
  name: "timeout",
  description: "Gibt einem User einen Timeout",
  permissions: PermissionsBitField.Flags.ModerateMembers,
  options: [
    {
      name: "user",
      description: "Der User",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "duration",
      description: "Dauer in Minuten",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "reason",
      description: "Grund",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  callback: async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guild) return;

    const user = interaction.options.get("user")?.user;
    const duration = interaction.options.get("duration")?.value as number;
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
    if (!reason) {
      return interaction.reply({
        content: "❌ Kein Grund angegeben.",
        ephemeral: true,
      });
    }

    if (!member.moderatable) {
      return interaction.reply({
        content: "❌ Ich kann diesen User nicht timeouten.",
        ephemeral: true,
      });
    }

    const ms = duration * 60 * 1000;

    await member.timeout(ms, reason);

    await interaction.reply(
      `⏳ **<@${user.id}>** wurde für **${duration} Minuten** getimeoutet.\n📝 Grund: ${reason}`
    );
  },
};
