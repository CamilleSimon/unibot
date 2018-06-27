const { Command } = require('discord.js-commando');
const discordFct = require('../discordFct');
const wowFct = require('../wow/wowFct');

const fs = require("fs");
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://' + jsonConfig.mongodb + ':27017/unibot';

var wowapi = jsonConfig.wowapi;
var bnet = require('battlenet-api')(wowapi);

var t;

function lookingfor(type, filter, ilvl, channel){
    var query = {};
    type = type.toLowerCase();
    filter = filter.toLowerCase();
    MongoClient.connect(url, function(err,db){
        if (err) throw err;
        db.collection("players").find({}).toArray(function(err,result) {
            if (err) throw err;
            if(!result || result == null){ 
                discordFct.errorMsg("Aucun résultat pour cette recherche !", channel);
            } else {
                for(var i = 0; i < result.length; i++){
                    var characters = result[i]["characters"];
                    for(var j = 0; j < characters.length; j++){
                        var character = characters[j];
                        if(character.game == "wow"){
                            if(type == "role" && filter == "heal")
                                filter = "healing";
                            wowFct.filter(type, filter, ilvl, character.server, character.name, result[i]["discordId"], channel);
                        }
                    }
                }
            }
            discordFct.successMsg("Toute la base des joueurs a été parcourue !", channel);
            db.close();
        });
    });
    
}

//Analyze chat message part
module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lookingfor',
            group: 'wow',
            memberName: 'lookingfor',
            description: 'Permet de recherche un rôle/une classe spécifique dans la base de donnée des players',
            examples: ['!lookingfor tank'],
            args: [
                {
                    key: 'type',
                    prompt: ' rechercher vous un `role` ou une `class` spécifique ?',
                    type: 'string',
                    validate: type =>{
                        t = type;
                        type = type.toLowerCase();
                        if(!type && type != 'role' && type != "class")
                            return ' argument invalide. Quel est le rôle que vous rechercher ? `tank`, `heal` ou `dps`';
                        return true;
                    }
                },{
                    key: 'filter',
                    prompt: ' donner le nom du rôle ou de la classe. `tank`, `heal`, `dps`, `guerrier`, `paladin`, `chasseur`, `voleur`, `prêtre`, `chevalier de la mort`, `chaman`, `mage`, `démoniste`, `moine`, `druide` ou `chasseur de démons`',
                    type: 'string',
                    validate: filter =>{
                        filter = filter.toLowerCase();
                        if(filter){
                            if(t == "role" && (filter == "tank" || filter == "heal" || filter == "dps"))
                                return true;
                            if(t == "class" && (filter == "guerrier" || filter == "paladin" || filter == "chasseur" || filter == "voleur" || filter == "prêtre" || filter == "chevalier de la mort" || filter == "chaman" || filter == "mage" || filter == "démoniste" || filter == "moine" || filter == "druide" || filter == "chasseur de démons"))
                                return true;
                            return ' argument invalide. Donner le nom du rôle ou de la classe. `tank`, `heal`, `dps`, `guerrier`, `paladin`, `chasseur`, `voleur`, `prêtre`, `chevalier de la mort`, `chaman`, `mage`, `démoniste`, `moine`, `druide` ou `chasseur de démons`';
                        }
                        return ' argument invalide. Donner le nom du rôle ou de la classe. `tank`, `heal`, `dps`, `guerrier`, `paladin`, `chasseur`, `voleur`, `prêtre`, `chevalier de la mort`, `chaman`, `mage`, `démoniste`, `moine`, `druide` ou `chasseur de démons`';
                    }
                },{
                    key: 'ilvl',
                    prompt: '',
                    type: 'integer',
                    default : 0
                }
            ]
        });
    }

	run(msg, {type, filter, ilvl}){
        console.log("Command : userprofile, author : " + msg.author.username + ", arguments : " + type + ", " + filter);
        lookingfor(type, filter, ilvl, msg);
	}
}