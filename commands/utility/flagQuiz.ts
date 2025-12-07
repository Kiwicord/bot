import axios from "axios";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { color, emoji } from "../../constants.js";

export default {
  name: "flag",
  description: "Startet ein Flaggen Quiz",
  callback: async (interaction: CommandInteraction) => {
    const channel = interaction.channel as TextChannel;

    const startRound = async (firstRound = false) => {
      const response: any = await axios.get(
        "https://restcountries.com/v3.1/all?fields=name,flags,translations"
      );
      const country =
        response?.data[Math.floor(Math.random() * response?.data?.length)];

      const embed = new EmbedBuilder()
        .setColor(color.PASTELL_GREEN)
        .setTitle(`${emoji.EXCLAMATION} Errate diese Flagge!`)
        .setImage(country?.flags?.png);

      const skipButton = new ButtonBuilder()
        .setCustomId("skip_flag")
        .setLabel("Flagge überspringen")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(emoji.THINK);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        skipButton
      );

      const answers = [
        country?.name?.common.toLowerCase(),
        country?.translations?.deu?.common?.toLowerCase(),
      ].filter(Boolean);

      if (firstRound) {
        await interaction.reply({
          embeds: [embed],
          content: `Antwortmöglichkeiten: ${answers.join(", ")}`,
          components: [row],
        });
      } else {
        await channel.send({
          embeds: [embed],
          content: `Antwortmöglichkeiten: ${answers.join(", ")}`,
          components: [row],
        });
      }

      const collector = channel.createMessageCollector({
        filter: (msg) => answers.includes(msg.content.toLowerCase()),
        time: 60 * 1000,
      });

      const buttonCollector = channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 60 * 1000,
      });

      let answered = false;

      collector.on("collect", (msg) => {
        msg.reply("Richtig!");
        answered = true;
        collector.stop();
        buttonCollector.stop();
      });

      collector.on("end", () => {
        if (!answered) {
          channel.send(
            `Niemand hats erraten, die richtige Antwort ist: ${answers.join(
              " / "
            )}`
          );
          collector.stop();
          buttonCollector.stop();
        }

        startRound(false);
      });

      buttonCollector.on(
        "collect",
        async (btnInteraction: ButtonInteraction) => {
          if (btnInteraction.customId === "skip_flag") {
            await btnInteraction.deferUpdate();
            channel.send("Flagge wurde übersprungen!");
            answered = true;
            collector.stop();
            buttonCollector.stop();
          }
        }
      );
    };
    startRound(true);
  },
} as Command;
