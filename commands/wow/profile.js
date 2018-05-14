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

function profile(server, name, channel){
    var r = {origin: 'eu', locale : '', realm: '', name:'', fields: ['talents', 'items']};
    r['realm'] = server;
    r['locale'] = 'fr_FR';
    r['name'] = name;
    bnet.wow.character.aggregate(r, function(error, response, body) {
        if(error) throw error;
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
    });
}

//Analyze chat message part
module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'profile',
            group: 'wow',
            memberName: 'profile',
            description: 'Affiche les informartions basiques sur un personnage',
            examples: ['!profile server name'],
            args: [
                {
                    key: 'server',
                    prompt: ' quel est le serveur du personnage ?',
                    type: 'string'
                },{
                    key: 'name',
                    prompt: ' quel est le nom du personnage ?',
                    type: 'string'
                }
            ]
        });
    }

	run(msg, {server, name}){
        console.log("Command : wowprofile, author : " + msg.author.lastMessage.member.nickname + ", arguments : " + server + ", " + name);
        profile(server, name, msg);
	}
}