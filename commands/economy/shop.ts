import {
  EmbedBuilder,
  PermissionsBitField,
  type CommandInteraction,
} from "discord.js";
import { color, emoji, ITEMS } from "../../constants.js";
import { formatCurrency } from "../../utility.js";

export default {
  name: "shop",
  description: "Ruft den Shop auf",
  permissions: PermissionsBitField.Flags.Administrator,
  callback: async (interaction: CommandInteraction) => {
    const embed = new EmbedBuilder()
      .setColor(color.PASTELL_GREEN)
      .setTitle("Shop");

    for (const item of ITEMS) {
      embed.addFields({
        name: `${emoji.DOT} ${item.name}`,
        value: ` ${item.description}\n${emoji.LINE_1}${emoji.LINE_2}${
          emoji.LINE_2
        }${emoji.LINE_2}${emoji.LINE_2}${emoji.LINE_2}${emoji.LINE_2}${
          emoji.LINE_2
        }${emoji.LINE_3}
        Preis: ${formatCurrency(item.price)}\nID: \`${item.name
          .toLowerCase()
          .replace(" ", "_")}\``,
      });
    }
    await interaction.reply({ embeds: [embed] });
  },
} as ICommand;