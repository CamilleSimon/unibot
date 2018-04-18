const commando = require('discord.js-commando');
const path = require('path');
const client = new commando.Client();
var fs = require("fs");
var token = fs.readFileSync("token.conf");

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['general', 'General'],
        ['ffxiv', 'FFXIV'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
    console.log('Logged in!');
    client.user.setGame("FINAL FANTASY XIV - REALM REBORN, Maybe");
    // or if on master, client.user.setActivity('game');
});

client.login('token');