const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const allowed = ["659993389365723157", "1472230708087885970"];

client.once("clientReady", () => {
  console.log("Bot connecté");
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("+dm") || message.author.bot) return;

  if (!allowed.includes(message.author.id)) return;

  const args = message.content.slice(3).trim();
  if (!args) return message.reply("Met Un Msg Trdc.");

  const guild = message.guild;
  await guild.members.fetch();

  for (const member of guild.members.cache.values()) {
    if (!member.user.bot) {
      await member.send(`${member}\n\n${args}`).catch(() => {});
      await new Promise(r => setTimeout(r, 800));
    }
  }

  message.reply("DM load !");
});

client.login(process.env.TOKEN);
