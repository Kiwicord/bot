import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  PermissionsBitField,
  TextChannel,
  type GuildBasedChannel,
} from "discord.js";
import ReactionRole from "../../db/schema/ReactionRole.js";

export default {
  name: "reactionRole",
  description: "Nigger",
  permissions: PermissionsBitField.Flags.Administrator,
  options: [
    {
      name: "message",
      required: true,
      description: "Die Nachricht der Reaction Role",
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "role",
      required: true,
      description: "Die zu vergebene Rolllllleeeeeeeeeeeee",
      type: ApplicationCommandOptionType.Role,
    },
    {
      name: "emoji",
      required: true,
      description: "Das Emoji",
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "channel",
      required: true,
      description: "Der Channel wo die ReactionRole ist",
      type: ApplicationCommandOptionType.Channel,
    },
  ],
  callback: async (interaction: ChatInputCommandInteraction) => {
    const messageId = interaction.options.getString("message");
    const role = interaction.options.getRole("role");
    const emoji = interaction.options.getString("emoji");
    const channel = interaction.options.getChannel("channel");

    if (!messageId || !role || !emoji || !channel) return;

    await ReactionRole.create({
      emoji,
      messageId,
      roleId: role.id,
      channelId: channel?.id,
    });

    const textChannel = (await interaction.guild?.channels.fetch(
      channel.id
    )) as TextChannel;
    const message = await textChannel?.messages.fetch(messageId);

    await message.react(emoji)

    await interaction.reply({
      content: "erfolgreich Sie NEGUS!",
    });
  },
} as ICommand;
