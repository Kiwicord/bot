import {
  ChannelType,
  EmbedBuilder,
  type APIEmbedField,
  type CommandInteraction,
} from "discord.js";
import { format } from "date-fns";

export default {
  name: "Statistic",
  description: "Erstellt eine Server Statistik",
  callback: async (interaction: CommandInteraction) => {
    const guild = interaction?.guild;
    const channels = await guild?.channels?.fetch();
    const members = await guild?.members?.list();

    const getChannelCount = (type: ChannelType) => {
      return channels?.filter((channel) => channel?.type === type).size;
    };

    const emoji = {
      DOT: "<:kc_punkt:1440369092283470006>",
      LINE_1: "<:kc_strich1:1055843946342907954>",
      LINE_2: "<:kc_strich2:1055843970753769532>",
      LINE_3: "<:kc_strich3:1055843972267900988>",
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
          .setColor(0x77dd77)
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
} as Command;
