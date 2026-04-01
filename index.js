const { Client, GatewayIntentBits, Partials } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

client.once("ready", () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("+dm")) return;
  if (!message.guild) return;

  const args = message.content.slice(3).trim();
  if (!args) return message.reply("Met un message p4 de merde.");

  await message.guild.members.fetch();

  const members = message.guild.members.cache
    .filter(m => !m.user.bot);

  let dmCount = 0;
  const totalMembers = members.size;
  const totalBlocks = 20;

  const embed = {
    description:
      `**Message : ${args}**\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Progression : ${"░".repeat(totalBlocks)}\n` +
      `Pourcentage : 0%\n\n` +
      `DM : 0`,
    color: 0xFFFFFF
  };

  const msg = await message.channel.send({ embeds: [embed] });

  for (const member of members.values()) {
    try {
      await member.send(`${args}\n\n<@${member.id}>`);
      dmCount++;
    } catch (e) {}

    const progress = Math.floor((dmCount / totalMembers) * 100);
    const filled = Math.round((progress / 100) * totalBlocks);
    const bar = "█".repeat(filled) + "░".repeat(totalBlocks - filled);

    embed.description =
      `**Message : ${args}**\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Progression : ${bar}\n` +
      `Pourcentage : ${progress}%\n\n` +
      `DM : ${dmCount}`;

    await msg.edit({ embeds: [embed] });

    await new Promise(r => setTimeout(r, 500));
  }
});

client.login(process.env.TOKEN);
