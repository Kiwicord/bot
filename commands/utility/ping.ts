import {
  PermissionsBitField,
  type CommandInteraction,
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags,
} from "discord.js";

export default {
  name: "Ping",
  description: "Replies with Pong",
  permissions: PermissionsBitField.Flags.Administrator,
  callback: async (interaction: CommandInteraction) => {
    await interaction.deferReply();

    const apiPing = Math.round(interaction.client.ws.ping);

    // Get router's public IP address
    let routerIp = "Unknown";
    let location = "Unknown";
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      routerIp = data.ip;

      // Get location from IP
      const locationResponse = await fetch(
        `http://ip-api.com/json/${routerIp}`
      );
      const locationData = await locationResponse.json();
      if (locationData.status === "success") {
        location = `${locationData.city}, ${locationData.regionName}, ${locationData.country}`;
      }
    } catch (error) {
      console.error("Failed to fetch router IP:", error);
    }

    const username = interaction.user.tag;
    const userId = interaction.user.id;

    const container = new ContainerBuilder();

    const pingText = new TextDisplayBuilder().setContent(
      [
        "## 🏓 Pong!",
        `📡 **Ping:** ${apiPing}ms`,
        `🐒 **IP:** ${routerIp}`,
        `💀 **Location:** ${location}`,
        `👤 **Username:** ${username}`,
        `🆔 **Discord ID:** ${userId}`,
      ].join("\n")
    );

    container.addTextDisplayComponents(pingText);

    await interaction.editReply({
      flags: MessageFlags.IsComponentsV2,
      components: [container],
    });
  },
} as ICommand;
