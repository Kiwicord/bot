import {
  LabelBuilder,
  ModalBuilder,
  Events,
  TextInputBuilder,
  TextInputStyle,
  type Interaction,
} from "discord.js";

export default {
  event: Events.InteractionCreate,
  once: false,
  callback: async (interaction: Interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId !== "become_partner_button") return;

    const modal = new ModalBuilder()
      .setCustomId("become_partner_modal")
      .setTitle("Partner werden");

    const link = new LabelBuilder()
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId("partner_link")
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setPlaceholder("discord.gg/xxxxxxxxx")
      )
      .setLabel("Invite Link");

    const name = new LabelBuilder()
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId("partner_name")
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
      )
      .setLabel("Name des Servers");

    const description = new LabelBuilder()
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId("partner_description")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMinLength(10)
          .setMaxLength(1000)
      )
      .setLabel("Kleine Beschreibung");

    modal.addLabelComponents([name, description, link]);

    await interaction.showModal(modal);
  },
} as IEvent;
