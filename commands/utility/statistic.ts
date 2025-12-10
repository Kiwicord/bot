import {
  ChannelType,
  EmbedBuilder,
  PermissionsBitField,
  type APIEmbedField,
  type CommandInteraction,
} from "discord.js";
import { format } from "date-fns";
import { color, emoji } from "../../constants.js";

export default {
  name: "Statistic",
  description: "Erstellt eine Server Statistik",
  permissions: PermissionsBitField.Flags.Administrator,
  callback: async (interaction: CommandInteraction) => {
    const guild = interaction?.guild;
    const channels = await guild?.channels?.fetch();
    const members = await guild?.members?.list();

    const getChannelCount = (type: ChannelType) => {
      return channels?.filter((channel) => channel?.type === type).size;
    };

    const stats = {
      "Allgemeine Zahlen und Daten": {
        Gründungsdatum: guild?.createdAt
          ? format(guild?.createdAt, "dd.MM.yyyy")
          : "-",
        Mitglieder: guild?.memberCount,
        Kategorien: getChannelCount(ChannelType.GuildCategory),
        Chatkanäle: getChannelCount(ChannelType.GuildText),
        Sprachkanäle: getChannelCount(ChannelType.GuildVoice),
        Bots: members?.filter((member) => member.user.bot === true).size,
      },
      "Eventhistorie und Eventränge": {
        "Vergangene Events": ["Kiwicord 100 Member Event (Feb 22)"],
        Eventränge: [
          "<@&1055850205045604352>",
          "<@&1055847330210906203>",
          "<@&919256478018318366>",
        ],
      },
      Partnerschaften: {
        "Aktuelle Partner": 0,
      },
      Serverteam: {
        Owner: ["<@733403498766401554>"],
        Teamleitung: ["<@771108568509972490>"],
        Developer: ["<@745717254678904862>", "<@977993035717681252>"],
        Moderator: [],
        Eventabteilung: [],
        Supporter: [],
      },
    };

    const fields: APIEmbedField[] = Object.entries(stats)?.map(
      ([category, content]) => ({
        name: category,
        value: Object.entries(content)
          ?.map(
            ([k, v]) =>
              `${emoji.DOT} ${k}: ${k === "Eventränge" ? "\n" : ""}${v} `
          )
          .join("\n"),
      })
    );

    await interaction.reply({
      // content: `${members?.map((item) => item)?.join(",")}`,
      embeds: [
        new EmbedBuilder()
          .setColor(color.PASTELL_GREEN)
          .setTitle("Kiwicord Statistik")
          .setFields(fields)
          .setFooter({
            text: `Stand: ${format(new Date(), "dd.MM.yyyy HH:mm")}`,
            iconURL: guild?.iconURL() as string,
          }),
      ],
      withResponse: false,
    });
  },
} as ICommand;
