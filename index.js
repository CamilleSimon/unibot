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
        ['ffxiv', 'FFXIV'],
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

<<<<<<< HEAD
client.login(jsonConfig.token);
=======
client.login('token');
>>>>>>> 0bf237dbe71a513bb1638553be0d5e3f28858d81
