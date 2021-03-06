const fs = require("fs");
const discordFct = require('../discordFct');

var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);
var wowapi = jsonConfig.wowapi;
var bnet = require('blizzard.js').initialize({apikey: wowapi});

var content = fs.readFileSync("commands/wow/color.json");
var colorTab = JSON.parse(content);
content = fs.readFileSync("commands/wow/race.json");
var raceTab = JSON.parse(content);
content = fs.readFileSync("commands/wow/class.json");
var classTab = JSON.parse(content);

module.exports = {

    profile : function(server, name, channel, send){
        var fields = ['talents', 'items'];
        var request = {origin: 'eu', locale : '', realm: '', name:''};
        request['realm'] = server;
        request['locale'] = 'fr_FR';
        request['name'] = name;
        bnet.wow.character(fields, request).then(response => {
            if(response.statusText!="undefined" && response.statusText!="nok"){
                character = response.data;
                var spe;
                var icon;
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
                switch(character.faction){
                    case 0 :
                        icon = "https://worldofwarcraft.akamaized.net/static/components/Logo/Logo-alliance.png"
                        break;
                    case 1 : 
                        icon = "https://worldofwarcraft.akamaized.net/static/components/Logo/Logo-horde.png"
                        break;
                    default :
                        icon = ""
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
                        "icon_url": icon
                    }
                }; 
                if(send == "send")
                    channel.send({embed});
                else
                    channel.say({ embed });
            } else {
                discordFct.errorMsg("Le personnage n'a pas été trouver !\nVérifiez que vous avez bien utilisé les bons paramètres\n!profile <serveur> <nom>", channel, send);
            }
        });
    },

    filter : function(type, filter, server, name, discordId, channel, send){
        var fields = ['talents', 'items'];
        var request = {origin: 'eu', locale : '', realm: '', name:''};
        request['realm'] = server;
        request['locale'] = 'fr_FR';
        request['name'] = name;
        bnet.wow.character(fields, request).then(response => {
            if(response.statusText!="undefined" && response.statusText!="nok"){
                character = response.data;
                if((type == "role" && character.talents[0].spec.role.toLowerCase() == filter) || (type == "class" && classTab[character.class].toLowerCase() == filter)){
                    var spe;
                    var icon;
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
                    switch(character.faction){
                        case 0 :
                            icon = "https://worldofwarcraft.akamaized.net/static/components/Logo/Logo-alliance.png"
                            break;
                        case 1 : 
                            icon = "https://worldofwarcraft.akamaized.net/static/components/Logo/Logo-horde.png"
                            break;
                        default :
                            icon = ""
                    }
                    const embed = {
                        "description": "**Serveur** : " + character.realm + 
                        "\n**Niveau** : " + character.level + 
                        "\n**Classe** : " + classTab[character.class] + 
                        "\n**Niveau d'objects moyen **: " + character.items.averageItemLevel +
                        "\n**Spécialité** : " + character.talents[0].spec.name + " " + spe +
                        "\n**Pseudo discord** : "  + channel.guild.members.find('id', discordId).nickname,
                        "color": colorTab[character.class],
                        "timestamp": new Date(),
                        "thumbnail": {
                            "url": "https://render-eu.worldofwarcraft.com/character/" + character.thumbnail
                        },
                        "author": {
                            "name": character.name,
                            "url": "https://worldofwarcraft.com/fr-fr/character/"  + character.realm  +"/" + character.name,
                            "icon_url": icon
                        }
                    }; 
                    if(send == "send")
                        channel.send({embed});
                    else
                        channel.say({ embed });
                }
            } else {
                discordFct.errorMsg("Le personnage n'a pas été trouver !\nVérifiez que vous avez bien utilisé les bons paramètres\n!profile <serveur> <nom>", channel, send);
            }
        });
    }
        
}