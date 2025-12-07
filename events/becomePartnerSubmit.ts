import {
  ChannelType,
  EmbedBuilder,
  Events,
  MessageFlags,
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

    if (channel) {
      await channel.send({
        content: `Neues Partner-Formular von <@${interaction.user.id}>`,
        embeds: [
          new EmbedBuilder()
            .setColor(0x77dd77)
            .addFields({ name: "Server", value: name })
            .addFields({ name: "Beschreibung", value: description })
            .addFields({ name: "Invite Link", value: link }),
        ],
      });
      await interaction.reply({ content: "Deine Anfrage wurde erstellt. Innerhalb von max. 24 Stunden bekommst du eine Rückmeldung", flags: MessageFlags.Ephemeral });
    }
  },
} as IEvent;
