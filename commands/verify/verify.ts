import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  ContainerBuilder,
  GuildMember,
  MessageFlags,
  PermissionsBitField,
  TextDisplayBuilder,
} from "discord.js";
import { role } from "../../constants.js";

export default {
  name: "verify",
  description: "Schickt einen User in die Verifizierung",
  permissions: PermissionsBitField.Flags.Administrator,
  options: [
    {
      name: "user",
      description: "Der User der in die Verifizierung geschickt werden soll",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
  ],
  callback: async (interaction: ChatInputCommandInteraction) => {
    const user = interaction.options.getMember("user") as GuildMember;
    if (!user) return;
    const verifyRole = await interaction.guild?.roles.fetch(
      role.VERFIY_REQUIRED
    );
    if (!verifyRole) return;

    const container = new ContainerBuilder();

    let textContent = "";

    if (user.roles.cache.has(role.VERFIY_REQUIRED)) {
      await user.roles.remove(verifyRole);
      textContent = `### <@${user.id}> wurde aus der Verifizierung genommen!`;
    } else {
      await user.roles.add(verifyRole);
      textContent = `### <@${user.id}> wurde in die Verifizierung geschickt!`;
    }

    const text = new TextDisplayBuilder().setContent(textContent);
    container.addTextDisplayComponents(text);

    await interaction.reply({
      flags: MessageFlags.IsComponentsV2,
      components: [container],
    });
  },
} as ICommand;
