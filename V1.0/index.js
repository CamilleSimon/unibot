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
    client.user.setGame("Final Fantasy XIV");
    // or if on master, client.user.setActivity('game');
});


client.login('MzcxOTc3NTIwNTIzOTAyOTg3.DNCBPg.ZGC3_XzdgPcdrk9lVxFVXL7ujuo');