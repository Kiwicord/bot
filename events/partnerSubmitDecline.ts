import {
  EmbedBuilder,
  Events,
  MessageFlags,
  type Interaction,
} from "discord.js";

export default {
  event: Events.InteractionCreate,
  once: true,
  callback: async (interaction: Interaction) => {
    if (!interaction.isButton()) return;
    if (
      !interaction.customId.startsWith("partner_accept") &&
      !interaction.customId.startsWith("partner_decline")
    )
      return;

    const [action, userId] = interaction.customId.split(":");

    if (!userId) {
      return await interaction.reply({
        flags: MessageFlags.Ephemeral,
        content:
          "Es wurde keine zugehörige UserID erkannt. Bitte den Nutzer manuell anschreiben!",
      });
    }

    const user = await interaction.guild?.members.fetch(userId);

    let content = "";

    switch (action) {
      case "partner_accept":
        content =
          "Du wurdest als Partner auf Kiwicord angenommen. Falls du weitere Fragen hast, kontaktiere gerne ein Teammitglied. Wir hoffen auf eine gute Zusammenarbeit!";
        break;
      case "partner_decline":
        content =
          "Du wurdest auf Kiwicord als Partner leider abgelehnt. Bitte kontaktiere ein Teammitglied, falls du Einwände hast.";
        break;
    }

    const embed = new EmbedBuilder()
      .setColor(action === "partner_accept" ? 0x77dd77 : 0xff746c)
      .setTitle(
        `${
          action === "partner_accept"
            ? "<a:tada:913065338583781458>"
            : "<a:wumpus_spam:863831295850184745>"
        } Deine Partneranfrage auf Kiwicord`
      )
      .setDescription(content)
      .setFooter({
        text: `Entscheidung getroffen durch: ${interaction.user.username}`,
      });

    await user?.send({
      embeds: [embed],
    });

    await interaction.reply({
      content: "Deine Antwort wurde übermittelt.",
      flags: MessageFlags.Ephemeral,
    });
  },
} as IEvent;
