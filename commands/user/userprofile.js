const { Command } = require('discord.js-commando');
const discordFct = require('../discordFct');
const wowFct = require('../wow/wowFct');

const fs = require("fs");
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://' + jsonConfig.mongodb + ':27017/unibot';

function userprofile(discorduser, channel){
    var query = {};

    MongoClient.connect(url, function(err,db){
        if (err){
            discordFct.errorMsg("Une erreur est survenue, veuillez contacter mon propriétaire !\nConnexion à MongoDB impossible.", channel, send);
            throw err
        }else{
            query["discordId"] = discordFct.snowflakeToID(discorduser);
            db.collection("players").findOne(query, function(err,result) {
                if (err){
                    discordFct.errorMsg("Une erreur est survenue, veuillez contacter mon propriétaire !\nConnexion à la table `players` impossible.", channel, send);
                    throw err
                }else{
                    if(!result || result == null){ 
                        discordFct.errorMsg("Cet utilisateur n'a pas été trouver !\nVous devez au moins avoir un personnage enregistré pour pouvoir utiliser cette commande.\n!userprofile <@user>\n!useradd <@user> <game> <server> <name>", channel);
                    } else {
                        var characters = result["characters"];
                        for(var i = 0; i < characters.length; i++){
                            if(characters[i].game == "wow"){  
                                wowFct.profile(characters[i].server, characters[i].name, channel);
                            }
                        }
                    }
                    db.close();
                }
            });
        }
    });
}

//Analyze chat message part
module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'userprofile',
            group: 'user',
            memberName: 'userprofile',
            description: 'Affiche les informartions basiques sur un personnage',
            examples: ['!userprofile @user'],
            args: [
                {
                    key: 'discorduser',
                    prompt: ' quel est l\'utilisateur dont vous souhaitez voir le(s) personnage(s) ?',
                    type: 'string',
                    validate: discorduser =>{
                        if(!discorduser || !discordFct.isSnowflake(discorduser))
                            return ' argument invalide. Quel est l\'utilisateur dont vous souhaitez voir le(s) personnage(s) ?';
                        return true;
                    }
                }
            ]
        });
    }

	run(msg, {discorduser}){
        console.log("Command : userprofile, author : " + msg.author.username + ", arguments : " + discorduser);
        userprofile(discorduser, msg);
	}
}