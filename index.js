const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("clientReady", (client) => {
  console.log(`Connecté : ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("+dm") || message.author.bot) return;

  const args = message.content.slice(3).trim();
  if (!args) return message.reply("met un msg P4 DE MERDE.");

  const guild = message.guild;
  await guild.members.fetch();

  for (const member of guild.members.cache.values()) {
    if (!member.user.bot) {
      const msg = `${member}

${args}`;

      await member.send(msg).catch(() => {});
      await new Promise(r => setTimeout(r, 800)); 
    }
  }

  message.reply("DM LOAD ALL !");
});

client.login(process.env.TOKEN);
