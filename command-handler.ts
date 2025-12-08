import { Client, Events, REST, Routes, type Interaction } from "discord.js";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

interface CommandHandlerParams {
  token: string;
  commandsPath: string;
  applicationId: string;
  guildId: string;
  client: Client;
  interactionInterceptor?: (interaction: Interaction) => void;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class CommandHandler {
  private foldersPath;
  private commandFolders;
  private commands: Command[];
  private rest;
  private applicationId;
  private guildId;
  private client;
  private interactionInterceptor;

  constructor({
    token,
    commandsPath,
    applicationId,
    guildId,
    client,
    interactionInterceptor,
  }: CommandHandlerParams) {
    this.foldersPath = path.join(__dirname, commandsPath);
    this.commandFolders = fs.readdirSync(this.foldersPath);
    this.commands = [];
    this.rest = new REST().setToken(token);
    this.applicationId = applicationId;
    this.guildId = guildId;
    this.client = client;
    this.interactionInterceptor = interactionInterceptor;

    this.init();

    this.client.on(Events.InteractionCreate, async (interaction) => {
      await this.handleInteraction(interaction);
    });
  }

  private async init() {
    await this.load();
    await this.deploy();
  }

  private async load() {
    for (const folder of this.commandFolders) {
      const commandsPath = path.join(this.foldersPath, folder);
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = await import(pathToFileURL(filePath).href);
        this.commands.push(command.default);
      }
    }

    const eventsPath = path.join(__dirname, "events");
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const eventModule = await import(pathToFileURL(filePath).href);
      const event = eventModule.default;
      if (event.once) {
        this.client.once(
          event.event,
          async (...args) => await event.callback(...args)
        );
      } else {
        this.client.on(
          event.event,
          async (...args) => await event.callback(...args)
        );
      }
    }
  }

  private async deploy() {
    try {
      const body = this.commands.map((command) => this.parseCommand(command));
      const data = await this.rest.put(
        Routes.applicationGuildCommands(this.applicationId, this.guildId),
        {
          body,
        }
      );
      // @ts-ignore
      console.log(`loaded ${data.length} commands`);
    } catch (error) {
      console.log("error", error);
    }
  }

  private async handleInteraction(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    const command = this.commands.find(
      (cmd) => cmd.name.toLowerCase() === interaction.commandName.toLowerCase()
    );
    if (!command) {
      await interaction.reply({
        content: "Command not found.",
        ephemeral: true,
      });
      return;
    }

    try {
      if (this.interactionInterceptor) this.interactionInterceptor(interaction);
      await command.callback(interaction);
    } catch (error) {
      console.error(error);
      if (!interaction.replied) {
        await interaction.reply({
          content: "There was an error executing this command.",
          ephemeral: true,
        });
      }
    }
  }

  private parseCommand(command: Command) {
    return {
      name: command.name.toLowerCase(),
      description: command.description,
      options: command.options?.map((opt) => ({
        name: opt.name.toLowerCase(),
        description: opt.description,
        type: opt.type,
        required: opt.required ?? false,
      })),
      default_member_permissions: command.permissions
        ? command.permissions.toString()
        : null,
    };
  }
}
