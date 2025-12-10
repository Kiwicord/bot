import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import User from "../../db/schema/User.js";
import { color, emoji } from "../../constants.js";
import { format } from "date-fns";

export default {
  name: "balance",
  description: "Check balance",
  options: [
    {
      name: "user",
      type: ApplicationCommandOptionType.User,
      description: "Nutzer",
      required: false,
    },
  ],
  callback: async (interaction: ChatInputCommandInteraction) => {
    const optionUser = interaction.options.get("user");
    const user = await User.findOne({
      discordId: optionUser?.user?.id || interaction.user.id,
    });

    const embedTitle = optionUser?.user
      ? `${optionUser?.user?.displayName}'s Kontostand`
      : "Kontostand";

    const embedDescription = optionUser?.user
      ? `${optionUser?.user?.displayName}'s Kontostand beträgt **${user?.balance}**🥝`
      : `Dein Kontostand beträgt **${user?.balance}**🥝`;

    const embed = new EmbedBuilder()
      .setColor(color.PASTELL_GREEN)
      .setTitle(`${emoji.EXCLAMATION} ${embedTitle}`)
      .setDescription(embedDescription)
      .setFooter({ text: format(new Date(), "dd.MM.yyyy HH:mm") });

    await interaction.reply({
      embeds: [embed],
    });
  },
} as ICommand;
