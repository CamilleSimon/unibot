const { Command } = require('discord.js-commando');
const fs = require("fs");
const util = require('../ffxiv/util');
var MongoClient = require('mongodb').MongoClient;
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
                    prompt: ' witch game do you play ? Valide games: ```wow, ffxiv``` \n A quelle jeu jouez-vous ? Jeux valides : ```wow, ffxiv```',
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
                        return 'invalid game. Witch game do you play ? Valide games are : ```wow, ffxiv``` \n Jeu invalide. A quelle jeu jouez-vous ? Jeux valides : ```wow, ffxiv```';
                    } 
                },{
                    key: 'server',
                    prompt: ' on which server do you play ? \n Sur quelle serveur jouez-vous ?',
                    type: 'string'
                },{
                    key: 'name',
                    prompt: ' what is the name of your character ? \n Quelle est le nom de ',
                    type: 'string'
                }
            ]
        });
    }

	run(msg, { game, server, name }){
		console.log("Command : playeradd, author : " + msg.author + ", arguments : " + game + ", " + ", " + server + ", " + name);
        if(game == "wow")
            say("https://worldofwarcraft.com/fr-fr/character/" + server + "/" + name);
	}
}