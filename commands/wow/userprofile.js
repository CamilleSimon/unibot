const { Command } = require('discord.js-commando');
const fs = require("fs");
const util = require('../util');
const utile = require('./utile');

var request = require("request");
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://' + jsonConfig.mongodb + ':27017/unibot';
var wowapi = jsonConfig.wowapi;

var content = fs.readFileSync("commands/wow/color.json");
var colorTab = JSON.parse(content);
content = fs.readFileSync("commands/wow/race.json");
var raceTab = JSON.parse(content);
content = fs.readFileSync("commands/wow/class.json");
var classTab = JSON.parse(content);

function profile(discorduser, channel){
    var query = {};
    var msg = "";

    MongoClient.connect(url, function(err,db){

        if (err) throw err;

        query["discordId"] = util.snowflakeToID(discorduser);

        db.collection("players").findOne(query, function(err,result) {

            if (err) throw err;

            var characters = result["characters"];

            for(var i = 0; i < characters.length; i++){
                if(characters[i].game == "wow"){
                    console.log("https://eu.api.battle.net/wow/character/"+characters[i].server+"/"+characters[i].name+"?apikey=" + wowapi);
                    request(encodeURI("https://eu.api.battle.net/wow/character/"+characters[i].server+"/"+characters[i].name+"?apikey=" + wowapi), function(error, response, body) {
                        if(error) throw error;
                        console.log(body);
                        character = JSON.parse(body);

                        const embed = {
                            "description": "**Serveur** : " + character.realm + "\n**Niveau :** " + character.level + "\n**Classe :** " + classTab[character.class],
                            "color": colorTab[character.class],
                            "timestamp": new Date(),
                            "thumbnail": {
                              "url": "https://render-eu.worldofwarcraft.com/character/" + character.thumbnail
                            },
                            "author": {
                              "name": character.name + " - " + character.realm,
                              "url": "https://worldofwarcraft.com/fr-fr/character/"  + character.realm  +"/" + character.name,
                              "icon_url": "https://worldofwarcraft.akamaized.net/static/components/Logo/Logo-horde.png"
                            }
                        };
                        
                        channel.say({ embed });
                    });
                }
            }
            db.close();
        });
    });
    
}

//Analyze chat message part
module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'userprofile',
            group: 'wow',
            memberName: 'userprofile',
            description: 'Affiche les informartions basiques sur un personnage',
            examples: ['!userprofile @user'],
            args: [
                {
                    key: 'discorduser',
                    prompt: ' quel est l\'utilisateur dont vous souhaitez voir le(s) personnage(s) ?',
                    type: 'string',
                    validate: discorduser =>{
                        if(!discorduser || !util.isSnowflake(discorduser))
                            return ' argument invalide. Quel est l\'utilisateur dont vous souhaitez voir le(s) personnage(s) ?';
                        return true;
                    }
                }
            ]
        });
    }

	run(msg, {discorduser}){
        console.log("Command : wowuserprofile, author : " + msg.author.lastMessage.member.nickname + ", arguments : " + discorduser);
        profile(discorduser, msg);
	}
}