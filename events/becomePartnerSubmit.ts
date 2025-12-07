import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  MessageFlags,
  TextDisplayBuilder,
  type GuildTextBasedChannel,
  type Interaction,
} from "discord.js";

export default {
  event: Events.InteractionCreate,
  once: false,
  callback: async (interaction: Interaction) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId !== "become_partner_modal") return;

    const PARTNER_SUBMIT_CHANNEL = "1447302588440645836";
    const channel = (await interaction.guild?.channels.fetch(
      PARTNER_SUBMIT_CHANNEL
    )) as GuildTextBasedChannel;

    const link = interaction.fields.getTextInputValue("partner_link");
    const name = interaction.fields.getTextInputValue("partner_name");
    const description = interaction.fields.getTextInputValue(
      "partner_description"
    );

    const msg = new TextDisplayBuilder().setContent(
      `Neues Partner-Formular von <@${interaction.user.id}>\n` +
        `Server: ${name}\nBeschreibung: ${description}\nInvite Link: ${link}`
    );

    const acceptButton = new ButtonBuilder()
      .setEmoji("✅")
      .setLabel("Annehmen")
      .setStyle(ButtonStyle.Success)
      .setCustomId(`partner_accept:${interaction.user.id}`);

    const declineButton = new ButtonBuilder()
      .setEmoji("❌")
      .setLabel("Ablehnen")
      .setStyle(ButtonStyle.Danger)
      .setCustomId(`partner_decline:${interaction.user.id}`);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      acceptButton,
      declineButton
    );

    if (channel) {
      await channel.send({
        flags: MessageFlags.IsComponentsV2,
        components: [msg, row],
      });
      await interaction.reply({
        content:
          "Deine Anfrage wurde erstellt. Innerhalb von max. 24 Stunden bekommst du eine Rückmeldung",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
} as IEvent;
