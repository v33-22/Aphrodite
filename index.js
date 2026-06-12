import { Client, GatewayIntentBits } from ‘discord.js’;
import fs from ‘fs’;

const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent,
GatewayIntentBits.GuildMembers
]
});

// ––––– AFK –––––

function loadAFK() {
return JSON.parse(fs.readFileSync(’./data/afk.json’, ‘utf8’));
}

function saveAFK(data) {
fs.writeFileSync(’./data/afk.json’, JSON.stringify(data, null, 2));
}

// ––––– Mood –––––

function loadMood() {
return JSON.parse(fs.readFileSync(’./data/mood.json’, ‘utf8’));
}

function saveMood(data) {
fs.writeFileSync(’./data/mood.json’, JSON.stringify(data, null, 2));
}

// ––––– Ready –––––

client.once(‘ready’, () => {
console.log(‘PHX-22 is online!’);
});

// ––––– Welcome –––––

client.on(‘guildMemberAdd’, (member) => {
const channel = member.guild.systemChannel;

if (!channel) return;

channel.send(
Welcome, ${member}! I'm PHX-22. Make yourself comfortable and enjoy your stay.
);
});

// ––––– Messages –––––

client.on(‘messageCreate’, (message) => {
if (message.author.bot) return;

const msg = message.content.toLowerCase();
const afkData = loadAFK();
const moodData = loadMood();

// Remove AFK

if (afkData[message.author.id]) {
delete afkData[message.author.id];
saveAFK(afkData);

message.reply(
  'Welcome back. I removed your AFK status.'
);

}

// AFK mention alerts

for (const user of message.mentions.users.values()) {
if (afkData[user.id]) {
message.reply(
${user.username} is currently AFK: ${afkData[user.id].reason}
);
}
}

// Ping

if (msg === ‘!ping’) {
return message.reply(‘Pong!’);
}

// View Mood

if (msg === ‘!mood’) {
return message.reply(
My current mood is: ${moodData.mood}
);
}

// Set Mood

if (msg.startsWith(’!setmood ’)) {
const newMood = message.content
.slice(9)
.trim()
.toLowerCase();

const allowedMoods = [
  'calm',
  'cheerful',
  'thoughtful',
  'sleepy'
];
if (!allowedMoods.includes(newMood)) {
  return message.reply(
    'Available moods: calm, cheerful, thoughtful, sleepy'
  );
}
saveMood({
  mood: newMood
});
return message.reply(
  `Mood changed to ${newMood}.`
);

}

// AFK Command

if (msg.startsWith(’!afk’)) {
const reason =
message.content.slice(5).trim() ||
‘Away from keyboard’;

afkData[message.author.id] = {
  reason
};
saveAFK(afkData);
return message.reply(
  `Okay, I've marked you as AFK: ${reason}`
);

}

// Mention Replies

if (message.mentions.has(client.user)) {
let replies;

switch (moodData.mood) {
  case 'cheerful':
    replies = [
      'Hey! Good to see you.',
      'Hi there! How can I help?',
      'You called?'
    ];
    break;
  case 'sleepy':
    replies = [
      'Hm? I am listening.',
      'Hey... what do you need?',
      'You called?'
    ];
    break;
  case 'thoughtful':
    replies = [
      'What would you like to talk about?',
      'I am listening.',
      'What is on your mind?'
    ];
    break;
  default:
    replies = [
      'Hey, what is up?',
      'I am here if you need anything.',
      'How can I help?',
      'Need something?'
    ];
}
const reply =
  replies[Math.floor(Math.random() * replies.length)];
return message.reply(reply);

}

// Name Detection

if (
msg.includes(‘phx-22’) ||
msg.includes(‘phx22’)
) {
const replies = [
‘I heard my name.’,
‘I am here.’,
‘Did you need something?’,
‘What is up?’,
‘How can I help?’
];

const reply =
  replies[Math.floor(Math.random() * replies.length)];
return message.reply(reply);

}
});

client.login(process.env.TOKEN);
