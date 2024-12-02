require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const path = require('path');

const app = express();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction
    ]
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Discord bot token
const TOKEN = process.env.DISCORD_TOKEN;

// Bot events
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Bot is in ${client.guilds.cache.size} servers`);
    console.log(`Serving ${client.users.cache.size} users`);
});

client.on('error', error => {
    console.error('Discord client error:', error);
});

client.on('shardError', error => {
    console.error('WebSocket connection error:', error);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // Basic commands
    if (message.content.startsWith('!')) {
        const command = message.content.slice(1).toLowerCase();

        switch (command) {
            case 'ping':
                message.reply('Pong! 🏓');
                break;
            case 'help':
                message.reply('Available commands: !ping, !help, !stats');
                break;
            case 'stats':
                const serverCount = client.guilds.cache.size;
                const userCount = client.users.cache.size;
                message.reply(`Bot Stats:\nServers: ${serverCount}\nUsers: ${userCount}`);
                break;
        }
    }
});

// API Routes
app.get('/api/stats', async (req, res) => {
    try {
        // Get real-time stats from Discord client
        const serverCount = client.guilds.cache.size;
        const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        const availableCommands = ['ping', 'help', 'stats', 'ban', 'kick', 'balance', 'daily', 'rank', 'leaderboard'];

        const stats = {
            servers: serverCount,
            users: totalMembers,
            commands: availableCommands.length,
            status: client.user?.presence.status || 'offline'
        };
        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
    }
});

app.get('/api/servers', async (req, res) => {
    try {
        if (!client.isReady()) {
            throw new Error('Discord client is not ready');
        }
        
        const guilds = Array.from(client.guilds.cache.values());
        const serverList = guilds.map(guild => ({
            id: guild.id,
            name: guild.name,
            icon: guild.iconURL({ dynamic: true, size: 64 }) || '/assets/images/default-server.png',
            memberCount: guild.memberCount,
            managed: guild.members.cache.get(client.user.id)?.permissions.has('Administrator') || false
        }));
        
        res.json(serverList);
    } catch (error) {
        console.error('Error fetching servers:', error);
        res.status(500).json({ 
            error: 'Failed to fetch servers',
            message: error.message 
        });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        botConnected: client.isReady(),
        uptime: client.uptime,
        serverCount: client.guilds.cache.size
    });
});

app.post('/api/invite', async (req, res) => {
    try {
        const invite = await client.generateInvite({
            permissions: ['Administrator'],
            scopes: ['bot']
        });
        res.json({ invite });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate invite link' });
    }
});

// Basic command handlers
const commands = {
    moderation: {
        ban: async (message, args) => {
            if (!message.member.permissions.has('BAN_MEMBERS')) {
                return message.reply('You do not have permission to ban members.');
            }
            const user = message.mentions.users.first();
            if (!user) {
                return message.reply('Please mention a user to ban.');
            }
            try {
                await message.guild.members.ban(user);
                message.reply(`Successfully banned ${user.tag}`);
            } catch (error) {
                message.reply('Failed to ban user.');
            }
        },
        kick: async (message, args) => {
            if (!message.member.permissions.has('KICK_MEMBERS')) {
                return message.reply('You do not have permission to kick members.');
            }
            const user = message.mentions.users.first();
            if (!user) {
                return message.reply('Please mention a user to kick.');
            }
            try {
                await message.guild.members.kick(user);
                message.reply(`Successfully kicked ${user.tag}`);
            } catch (error) {
                message.reply('Failed to kick user.');
            }
        }
    },
    economy: {
        balance: async (message) => {
            // Implement balance checking logic
            message.reply('Balance system coming soon!');
        },
        daily: async (message) => {
            // Implement daily rewards logic
            message.reply('Daily rewards system coming soon!');
        }
    },
    leveling: {
        rank: async (message) => {
            // Implement rank checking logic
            message.reply('Leveling system coming soon!');
        },
        leaderboard: async (message) => {
            // Implement leaderboard logic
            message.reply('Leaderboard system coming soon!');
        }
    }
};

// Start the server and bot
const PORT = process.env.PORT || 3000;

// Login the bot
client.login(TOKEN).catch(error => {
    console.error('Failed to login to Discord:', error);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
