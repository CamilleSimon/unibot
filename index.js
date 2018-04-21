const commando = require('discord.js-commando');
const path = require('path');
const client = new commando.Client();
var fs = require("fs");
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['general', 'General'],
        ['schedule', 'Schedule'],
        ['player', 'Player']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
    console.log('Logged in!');
    //I guess this follow line generate an error :
    //client.user.setGame("FINAL FANTASY XIV - REALM REBORN, Maybe");
    // or if on master, client.user.setActivity('game');
});

client.login(jsonConfig.token);
