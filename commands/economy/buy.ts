import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
import { color, emoji, ITEMS } from "../../constants.js";
import User from "../../db/schema/User.js";
import { formatCurrency } from "../../utility.js";

export default {
  name: "buy",
  description: "Kaufe ein Item",
  permissions: PermissionsBitField.Flags.Administrator,
  options: [
    {
      name: "item",
      description: "Das Item was du kaufen möchtest",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  callback: async (interaction: ChatInputCommandInteraction) => {
    const user = await User.findOne({ discordId: interaction.user.id });
    if (!user) return;

    const itemInput = interaction.options.getString("item");
    if (!itemInput) return;

    const item = ITEMS.find(
      (el) =>
        el.name.toLowerCase().replace(" ", "_") === itemInput.toLowerCase()
    );
    if (!item) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(color.PASTELL_RED)
            .setTitle(
              `${emoji.EXCLAMATION} Das Item konnte nicht gefunden werden`
            ),
        ],
      });
    }

    if (user?.balance < item.price) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(color.PASTELL_RED)
            .setTitle(
              `Du hast nicht genügend Geld. Dir fehlen noch ${formatCurrency(
                item.price - user?.balance
              )}`
            ),
        ],
      });
    }

    user.inventory.push(item);
    user.balance -= item.price;

    await user.save();

    const embed = new EmbedBuilder()
      .setColor(color.PASTELL_GREEN)
      .setTitle("Erfolgreich")
      .setDescription(
        `Du hast erfolgreich ${item.name} für ${formatCurrency(
          item.price
        )} gekauft!`
      );

    await interaction.reply({ embeds: [embed] });
  },
} as ICommand;
