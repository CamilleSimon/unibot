const { Command } = require('discord.js-commando');
const fs = require("fs");
const util = require('../ffxiv/util');
var MongoClient = require('mongodb').MongoClient;
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);
var url = 'mongodb://' + jsonConfig.mongodb + ':27017/unibot';

function addplayer(discorduser, game, server, name, channel){
    var query = {};
    console.log("Command : playeradd, author : " + discorduser + ", arguments : " + game + ", " + server + ", " + name);
    query["discord-user"] = discorduser;
    if (game == "ffxiv") {
        var player = {
            "discord-user" : discorduser,
            "ffxiv-server" : server,
            "ffxiv-name" : name
        };
    } else if (game == "wow"){
        var player = {
            "discord-user" : discorduser,
            "wow-server" : server,
            "wow-name" : name
        };
    }
    MongoClient.connect(url, function(err,db){
        if (err) throw err;
        db.collection("players").updateOne(query, player, {upsert: true}, function(err,doc) {
            if (err) throw err;
            channel.say("Success :" + game + " player " + name + " added.");
            db.close();
        });
    });
}

//TODO 

//Analyze chat message part
module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'playeradd',
            group: 'player',
            memberName: 'playeradd',
            description: 'Add a player in the database \n Ajoute un joueur à la base de données',
            examples: ['playeradd wow Shaykan', 'playeradd ffxiv Nyu Mori'],
            args: [
                {
                    key: 'game',
                    prompt: ' witch game do you play ? \n A quelle jeu jouez-vous ? ```wow, ffxiv```',
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
                        return 'invalid game. Witch game do you play ? \n A quelle jeu jouez-vous ? ```wow, ffxiv```';
                    } 
                },{
                    key: 'server',
                    prompt: ' on which server do you play ? \n Sur quelle serveur jouez-vous ?',
                    type: 'string'
                },{
                    key: 'name',
                    prompt: ' what is the name of your character ? \n Quelle est le nom de ',
                    type: 'string'
                },{
                    key: 'discorduser',
                    prompt: ' to which discord user do you want to add this character ? \n A quelle utilisateur discord voulez vous ajouter ce personnage ?',
                    type: 'string'
                }
            ]
        });
    }

	run(msg, {discorduser, game, server, name }){
//		console.log("Command : playeradd, author : " + msg.author + ", arguments : " + game + ", " + server + ", " + name);
        addplayer(discorduser, game, server, name, msg);
        //TODO Check valide characters => https://scotch.io
        //if(game == "wow")
        //    return msg.say("https://worldofwarcraft.com/fr-fr/character/" + server + "/" + name);
	}
}