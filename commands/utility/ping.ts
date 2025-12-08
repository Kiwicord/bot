import { PermissionsBitField, type CommandInteraction } from "discord.js";

export default {
  name: "Ping",
  description: "Replies with Pong",
  permissions: PermissionsBitField.Flags.Administrator,
  callback: async (interaction: CommandInteraction) => {
    const sent = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });

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

    await interaction.editReply({
      content: `🏓 Ponggggggggggggggg!\n📡 Ping: ${apiPing}ms\n🐒 IP: ${routerIp}\n💀 Location: ${location}\n👤 Username: ${username}\n🆔 Discord ID: ${userId}`,
    });
  },
} as Command;

//nga
