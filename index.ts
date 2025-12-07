import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import CommandHandler from "./command-handler.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const token = process.env.BOT_TOKEN!;

client.once(Events.ClientReady, (client) => {
  console.log(`---\nLogged in as ${client.user.username}\n---`);
  new CommandHandler({
    client,
    token,
    commandsPath: "commands",
    applicationId: process.env.CLIENT_ID!,
    guildId: process.env.DEV_GUILD_ID!,
  });
});

client.login(token);