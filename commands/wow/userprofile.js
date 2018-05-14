const { Command } = require('discord.js-commando');
const fs = require("fs");
const util = require('../util');
const utile = require('./utile');

var request = require("request");
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);

var wowapi = jsonConfig.wowapi;
var bnet = require('battlenet-api')(wowapi);

var content = fs.readFileSync("commands/wow/color.json");
var colorTab = JSON.parse(content);
content = fs.readFileSync("commands/wow/race.json");
var raceTab = JSON.parse(content);
content = fs.readFileSync("commands/wow/class.json");
var classTab = JSON.parse(content);

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://' + jsonConfig.mongodb + ':27017/unibot';

function profile(discorduser, channel){
    var query = {};
    var msg = "";

    MongoClient.connect(url, function(err,db){

        if (err) throw err;

        query["discordId"] = util.snowflakeToID(discorduser);
        //request on the db
        db.collection("players").findOne(query, function(err,result) {

            if (err) throw err;

            var characters = result["characters"];
            //for each character of the user
            for(var i = 0; i < characters.length; i++){
                if(characters[i].game == "wow"){
                    //request creation for blizzard db
                    var r = {origin: 'eu', locale : '', realm: '', name:'', fields: ['talents', 'items']};
                    r['realm'] = characters[i].server;
                    r['locale'] = 'fr_FR';
                    r['name'] = characters[i].name;
                    bnet.wow.character.aggregate(r, function(error, response, body) {
                        if(error) throw error;
                        if(response.status!="undefined" && response.status!="nok"){
                            character = response;
                            var spe;
                            switch(character.talents[0].spec.role) {
                                case "HEALING" : 
                                    spe = "<:HEALING:445549335132766208>"
                                    break;
                                case "DPS" :
                                    spe ="<:DPS:445554272877412352>"
                                    break;
                                default :
                                    spe = "<:TANKING:445554088852193280>"
                            }
                            const embed = {
                                "description": "**Serveur** : " + character.realm + 
                                "\n**Niveau** : " + character.level + 
                                "\n**Classe** : " + classTab[character.class] + 
                                "\n**Niveau d'objects moyen **: " + character.items.averageItemLevel +
                                "\n**Spécialité : **" + character.talents[0].spec.name + " " + spe,
                                "color": colorTab[character.class],
                                "timestamp": new Date(),
                                "thumbnail": {
                                    "url": "https://render-eu.worldofwarcraft.com/character/" + character.thumbnail
                                },
                                "author": {
                                    "name": character.name,
                                    "url": "https://worldofwarcraft.com/fr-fr/character/"  + character.realm  +"/" + character.name,
                                    "icon_url": "https://worldofwarcraft.akamaized.net/static/components/Logo/Logo-horde.png"
                                }
                            }; 
                            channel.say({ embed });
                        } else {
                            const embed = {
                                "description": "**Erreur !**\nLe personnage n'a pas été trouver !\nVérifiez que vous avez bien utilisé les bons paramètres\n!profile <serveur> <nom>",
                                "color": 0xff0000,
                                "timestamp": new Date(),
                                "thumbnail": {
                                    "url": "attachment://confuse_filly.png"
                                }
                            }; 
                        channel.say({ embed, files: [{ attachment: 'confuse_filly.png', name: 'confuse_filly.png' }] });
                        }
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