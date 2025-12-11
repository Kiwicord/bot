import {
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  EmbedBuilder,
  MessageFlags,
  PermissionsBitField,
  SectionBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  type CommandInteraction,
} from "discord.js";
import { color, emoji, ITEMS } from "../../constants.js";
import { formatCurrency } from "../../utility.js";

export default {
  name: "shop",
  description: "Ruft den Shop auf",
  permissions: PermissionsBitField.Flags.Administrator,
  callback: async (interaction: CommandInteraction) => {
    const container = new ContainerBuilder();

    const title = new TextDisplayBuilder().setContent("## Shop");

    container.addTextDisplayComponents(title);

    for (const item of ITEMS) {
      const itemText = new TextDisplayBuilder().setContent(
        [`### ${emoji.DOT} ${item.name}`, `${item.description}`].join("\n")
      );

      const buyButton = new ButtonBuilder()
        .setLabel(new Intl.NumberFormat("en-US").format(item.price))
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("🥝")
        .setCustomId(
          `shop_buy_button:${item.name.toLowerCase().replace(" ", "_")}`
        );

      const section = new SectionBuilder()
        .addTextDisplayComponents(itemText)
        .setButtonAccessory(buyButton);

      container.addSectionComponents(section);
      container.addSeparatorComponents((separator) =>
        separator.setSpacing(SeparatorSpacingSize.Large)
      );
    }

    const inventoryButton = new ButtonBuilder()
      .setCustomId("open_inventory")
      .setLabel("Inventar ansehen")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("<a:19dollar_fortnite_card:864140214734028800>");

    container.addActionRowComponents((row) =>
      row.addComponents(inventoryButton)
    );

    await interaction.reply({
      flags: MessageFlags.IsComponentsV2,
      components: [container],
    });
  },
} as ICommand;
