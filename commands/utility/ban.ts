import {
  PermissionsBitField,
  type ChatInputCommandInteraction,
  ApplicationCommandOptionType,
} from "discord.js";

export default {
  name: "ban",
  description: "Bannt einen User vom Server",
  permissions: PermissionsBitField.Flags.Administrator,
  options: [
    {
      name: "user",
      description: "Der User, der gebannt werden soll",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "reason",
      description: "Grund für den Bann",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  callback: async (interaction: ChatInputCommandInteraction) => {
    const user = interaction.options.get("user")?.user;
    const reason =
      interaction.options.get("reason")?.value?.toString() ??
      "Kein Grund angegeben";

    if (!user) {
      return interaction.reply({
        content: "❌ User nicht gefunden.",
        ephemeral: true,
      });
    }
    
    if (!reason) {
      return interaction.reply({
        content: "❌ Reason nicht gefunden.",
        ephemeral: true,
      });
    }

    const member = await interaction.guild?.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "❌ User ist nicht auf dem Server.",
        ephemeral: true,
      });
    }

    if (!member.bannable) {
      return interaction.reply({
        content: "❌ Ich kann diesen User nicht bannen (Rolle zu hoch?).",
        ephemeral: true,
      });
    }
    
    await member.send ({
        content: `Du wurdest von Kiwicord gebannt. 📝 Grund: ${reason}`
    })
    
    await interaction.reply({
      content: `🔨 **<@${user.id}>** wurde gebannt.\n📝 Grund: ${reason}`,
    });

    await member.ban({reason});
  },
};
