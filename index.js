const { Client, GatewayIntentBits, PermissionsBitField, Partials } = require('discord.js');

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
    console.log(`${client.user.tag} est en ligne !`);
});

const linkRegex = /(https?:\/\/|discord\.gg)/i;

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    /* ================= ANTI LINK ================= */
    if (message.guild && linkRegex.test(message.content)) {
        try {
            if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
            await message.delete().catch(() => {});
            await message.member.timeout(10 * 1000, "Lien interdit").catch(() => {});
        } catch (err) {
            console.log(err);
        }
    }

    /* ================= +DM ================= */
    if (!message.content.startsWith("+dm")) return;
    if (!message.guild) return;

    const args = message.content.slice(3).trim();
    if (!args) return message.reply("Met un message.");

    await message.guild.members.fetch();

    const members = message.guild.members.cache.filter(m => !m.user.bot);

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
