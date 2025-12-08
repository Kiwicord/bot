import { EmbedBuilder, Events, Message } from "discord.js";
import { channel, color, emoji } from "../constants.js";
import User from "../db/schema/User.js";

export default {
  event: Events.MessageCreate,
  once: false,
  callback: async (message: Message) => {
    if (message.channelId !== channel.KIWI_CHURCH) return;
    if (message.author.bot) return;
    if (message.toString().trim() !== emoji.KIWI_PRAY) {
      return await message.delete();
    }

    const user = await User.findOne({ discordId: message.author.id });
    const AMOUNT = 15;
    if (user) {
      await user.updateOne({ $inc: { balance: AMOUNT } });
    } else {
      await User.create({ discordId: message.author.id, balance: AMOUNT });
    }

    const embed = new EmbedBuilder()
      .setColor(color.PASTELL_GREEN)
      .setTitle(`${emoji.KIWI_PRAY}`)
      .setDescription(
        `Der Kiwi-Gott schenkt dir **${AMOUNT}**🥝 für das Beten!`
      );

    const msg = await message.reply({
      embeds: [embed],
    });

    setTimeout(async () => {
      await msg.delete();
    }, 5000);
  },
} as IEvent;
