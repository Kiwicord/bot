import { EmbedBuilder, Events, Message } from "discord.js";
import { channel, color, emoji } from "../constants.js";
import User from "../db/schema/User.js";
import { formatCurrency } from "../utility.js";

export default {
  event: Events.MessageCreate,
  once: false,
  callback: async (message: Message) => {
    const channels = [channel.ANIMALS, channel.MEDIA, channel.MEMES];
    if (!channels.includes(message.channelId)) return;
    if (message.attachments.size === 0) return;
    if (message.author.bot) return;

    const user = await User.findOne({ discordId: message.author.id });
    const AMOUNT = 20;

    if (user) {
      await user.updateOne({ $inc: { balance: AMOUNT } });
    } else {
      await User.create({
        discordId: message.author.id,
        balance: AMOUNT,
      });
    }

    const embed = new EmbedBuilder()
      .setColor(color.PASTELL_GREEN)
      .setTitle(`${emoji.EXCLAMATION} Nice!`)
      .setDescription(
        `Durch deinen Beitrag von Medienschrott hast du ${formatCurrency(
          AMOUNT
        )} verdient!`
      );

    const msg = await message.reply({
      embeds: [embed],
    });

    setTimeout(async () => {
      await msg.delete();
    }, 5000);
  },
} as IEvent;
