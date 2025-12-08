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
import User from "../../db/schema/User.js";

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
        country?.name?.common,
        country?.translations?.deu?.common,
      ].filter(Boolean);

      if (firstRound) {
        await interaction.reply({
          embeds: [embed],
          components: [row],
        });
      } else {
        await channel.send({
          embeds: [embed],
          components: [row],
        });
      }

      const collector = channel.createMessageCollector({
        filter: (msg) =>
          answers
            ?.map((ans) => ans.toLowerCase())
            ?.includes(msg.content.toLowerCase()),
        time: 60 * 1000,
      });

      const buttonCollector = channel.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 60 * 1000,
      });

      let answered = false;

      collector.on("collect", async (msg) => {
        const AMOUNT = 50;
        const user = await User.findOne({ discordId: msg.author.id });
        if (user) {
          await user.updateOne({ $inc: { balance: AMOUNT } });
        } else {
          await User.create({
            discordId: msg.author.id,
            balance: AMOUNT,
          });
        }

        const embed = new EmbedBuilder()
          .setColor(color.PASTELL_GREEN)
          .setTitle("Richtig!")
          .setDescription(
            `Du hast die Flagge richtig erraten und dafür **${AMOUNT}**🥝 verdient!`
          );
          
        msg.reply({
          embeds: [embed],
        });
        answered = true;
        collector.stop();
        buttonCollector.stop();
      });

      collector.on("end", () => {
        if (!answered) {
          channel.send(
            `Niemand hats erraten, die richtige Antwort wäre: ${answers?.at(1)}`
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
            channel.send(
              `Flagge wurde übersprungen! Die richtige Antwort wäre ${answers.join(
                " / "
              )}`
            );
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
