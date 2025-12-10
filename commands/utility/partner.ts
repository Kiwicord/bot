import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  PermissionsBitField,
  TextDisplayBuilder,
  type CommandInteraction,
} from "discord.js";

export default {
  name: "partner",
  description: "partner",
  permissions: PermissionsBitField.Flags.Administrator,
  callback: async (interaction: CommandInteraction) => {
    const button = new ButtonBuilder()
      .setEmoji("🤝")
      .setLabel("Partner werden")
      .setStyle(ButtonStyle.Success)
      .setCustomId("become_partner_button");

    const text = new TextDisplayBuilder().setContent("Partner");
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    await interaction.reply({
      flags: MessageFlags.IsComponentsV2,
      components: [text, row],
    });
  },
} as ICommand;
