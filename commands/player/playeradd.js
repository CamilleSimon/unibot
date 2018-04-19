const { Command } = require('discord.js-commando');
const fs = require("fs");
const util = require('./util');
var MongoClient = require('mongodb').MongoClient;
var fs = require("fs");
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);
var url = 'mongodb:// ' + jsonConfig.mongodb + ':27017/unibot';

//Analyze chat message part
module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'playeradd',
            group: 'player',
            memberName: 'playeradd',
            description: 'Add a player in the database',
            examples: ['playeradd wow Shaykan', 'playeradd ffxiv Nyu Mori'],
            args: [
                {
                    key: 'game',
                    prompt: ' witch game do you play ? Valide games : ```wow```, ````ffxiv``',
                    type: 'string',
                    validate: game => {
                        if (game == "wow" || 
                            game == "Wow" || 
                            game == "WoW" || 
                            game == "WOW" || 
                            game == "ffxiv" ||
                            game == "FFXIV"
                        ) 
                            return true;
                        return 'invalid game. Witch game do you play ? Valide games are : ```wow```, ````ffxiv``';
                    } 
                },{
                    key: 'name',
                    prompt: 'What is the name of your character ?',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }

	run(msg, { game, name }){
		console.log("Command : playeradd, author : " + msg.author + ", arguments : " + game + ", " + name);
        
	}
}