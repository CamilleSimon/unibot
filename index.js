const commando = require('discord.js-commando');
const path = require('path');
const client = new commando.Client();
var fs = require("fs");
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['wow'],
        ['user'],
	['general'],
	['schedule']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
    console.log('Logged in!');
});

client.login(jsonConfig.token);