import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import CommandHandler from "./command-handler.js";
import connectDB from "./db/connectDB.js";
import User from "./db/schema/User.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

const token = process.env.BOT_TOKEN!;

client.once(Events.ClientReady, async (client) => {
  console.log(`---\nLogged in as ${client.user.username}\n---`);
  await connectDB();
  new CommandHandler({
    client,
    token,
    commandsPath: "/commands",
    applicationId: process.env.CLIENT_ID!,
    guildId: process.env.DEV_GUILD_ID!,
    interactionInterceptor: async (interaction) => {
      const discordId = interaction.user.id;
      const user = await User.findOne({ discordId });
      if (!user) {
        await User.create({
          discordId,
          balance: 0,
        });
        console.log("created new user for", interaction.user.username);
      } else {
        console.log(interaction.user.username, "User already exists");
      }
    },
  });
});

client.login(token);
