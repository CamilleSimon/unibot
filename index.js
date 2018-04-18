const commando = require('discord.js-commando');
const path = require('path');
const client = new commando.Client();

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
    console.log('Hello world !');
    //client.user.setGame("FINAL FANTASY XIV - REALM REBORN, Maybe");
    // or if on master, client.user.setActivity('game');
});

client.login('MzcxOTc3NTIwNTIzOTAyOTg3.DNCBPg.ZGC3_XzdgPcdrk9lVxFVXL7ujuo');