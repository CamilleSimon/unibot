const { Command } = require('discord.js-commando');
const fs = require("fs");
const util = require('../general/util');
var MongoClient = require('mongodb').MongoClient;
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);
var url = 'mongodb://' + jsonConfig.mongodb + ':27017/unibot';

function add(discorduser, game, server, name, channel, user){
    console.log(user);
    //var id = user.id;
    //query init
    var query = {};
    //the query has to find an discord-user
    query["discord-user"] = discorduser;
    //the new character to add
    var character = {
        "game" : game,
        "server" : server,
        "name" : name
    };
    //connection to the DB
    MongoClient.connect(url, function(err,db){
        if (err) throw err;
        //add to the end the array 'characters' the element 'character'
        var newValue = { $set: { "user": user }, $addToSet: {"characters": character}};
        db.collection("players").updateOne(query, newValue, {upsert: true}, function(err,doc) {
            if (err) throw err;
            channel.say("Success : " + util.capsFirstLetter(name) + " is attached to " + discorduser + " user !");
            db.close();
        });
    });
}

//TODO check is the character really existe in the game => ask again if the character is not valide

//Analyze chat message part
module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'playeradd',
            group: 'player',
            memberName: 'playeradd',
            description: 'Add a player in the database \n Ajoute un joueur à la base de données',
            examples: ['playeradd @user wow Shaykan', 'playeradd @user ffxiv Nyu Mori'],
            args: [
                {
                    key: 'discorduser',
                    prompt: ' to which discord user do you want to add this character ? \n A quelle utilisateur discord voulez vous ajouter ce personnage ?',
                    type: 'string',
                    validate: discoruser =>{
                        if(!discoruser)
                            return ' invalide discord user. To which discord user do you want to add this character ? \n A quelle utilisateur discord voulez vous ajouter ce personnage ?';
                        return true;
                    }
                },{
                    key: 'game',
                    prompt: ' witch game do you play ? \n A quelle jeu jouez-vous ? \n `wow`, `ffxiv`',
                    type: 'string',
                    validate: game => {
                        game = game.toLowerCase();
                        if (game == "wow" || 
                            game == "ffxiv"
                        ) 
                            return true;
                        return 'invalid game. Witch game do you play ? \n A quelle jeu jouez-vous ? \n `wow`, `ffxiv`';
                    } 
                },{
                    key: 'server',
                    prompt: ' on which server do you play ? \n Sur quelle serveur jouez-vous ?',
                    type: 'string',
                    validate: server => {
                        if(!server)
                            ' invalide server. On which server do you play ? \n Sur quelle serveur jouez-vous ?';
                        return true;
                    }
                },{
                    key: 'name',
                    prompt: ' what is the name of your character ? \n Quelle est le nom de votre personnage ?',
                    type: 'string',
                    validate: name => {
                        if(!name)
                            return ' invalide name. What is the name of your character ? \n Quelle est le nom de votre personnage ?';
                        return true;
                    }
                }
            ]
        });
    }

	run(msg, {discorduser, game, server, name }){
        var user = channel.mentions.users.first();
        game = game.toLowerCase();
        server = server.toLowerCase();
        name = name.toLowerCase();
		console.log("Command : playeradd, author : " + msg.author.lastMessage.member.nickname + ", arguments : " + game + ", " + server + ", " + name);
        add(discorduser, game, server, name, msg, user);
        
        //TODO Check valide characters => https://scotch.io
        //if(game == "wow")
        //    return msg.say("https://worldofwarcraft.com/fr-fr/character/" + server + "/" + name);
	}
}