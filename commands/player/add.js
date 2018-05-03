const { Command } = require('discord.js-commando');
const fs = require("fs");
const util = require('../general/util');

var MongoClient = require('mongodb').MongoClient;
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);
var url = 'mongodb://' + jsonConfig.mongodb + ':27017/unibot';

var wowServers = {};
var ffServers = new Array("lobby", "behemoth", "brynhildr", "diabolos", "excalibur", "exodus", "famfrit", "hyperion", "lamia", "leviathan", "malboro", "ultros", "adamantoise","balmung","cactuar","coeurl","faerie","gilgamesh","goblin","jenova","mateus","midgardsormr","sargatanas","siren","zalera","aegis","atomos","carbuncle","garuda","gungnir","kujata","ramuh","tonberry","typhon","unicorn","alexander","bahamut","durandal","fenrir","ifrit","ridill","tiamat","ultima","valefor","yojimbo","zeromus","cerberus","lich","louisoix","moogle","odin","omega","phoenix","ragnarok","shiva","zodiark","anima","asura","belias","chocobo","hades","ixion","mandragora","masamune","pandaemonium","shinryu","titan");
var g;

function add(discorduser, game, server, name, spe, ilvl, channel, user){
    //var id = user.id;
    //query init
    var query = {};
    //the query has to find an discord-user
    query["discordId"] = util.snowflakeToID(discorduser);
    //the new character to add
    var character = {
        "game" : game,
        "server" : server,
        "name" : name,
        "spe" : spe,
        "ilvl" : ilvl
    };
    //connection to the DB
    MongoClient.connect(url, function(err,db){
        if (err) throw err;
        //add to the end the array 'characters' the element 'character'
        var newValue = { $addToSet: {"characters": character}};//$set: { "user": user }};
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
                    prompt: ' à quelle utilisateur discord voulez vous ajouter ce personnage ?',//to which discord user do you want to add this character ? \n 
                    type: 'string',
                    validate: discoruser =>{
                        if(!discoruser)
                            return false;//' argument invalide. A quelle utilisateur discord voulez vous ajouter ce personnage ?';//invalide discord user. To which discord user do you want to add this character ? \n
                        return true;
                    }
                },{
                    key: 'game',
                    prompt: ' à quelle jeu jouez-vous ? `wow`, `ffxiv`',//witch game do you play ? \n A
                    type: 'string',
                    validate: game => {
                        game = game.toLowerCase();
                        if (game == "wow" || game == "ffxiv"){
                            g = game;
                            return true;
                        }
                        return false;//' argument invalide. A quelle jeu jouez-vous ? \n `wow`, `ffxiv`';//invalid game. Witch game do you play ? \n A
                    } 
                },{
                    key: 'server',
                    prompt: ' sur quelle serveur jouez-vous ? `uldaman`, `derk\'thar`',//on which server do you play ? \n S
                    type: 'string',
                    validate: server => {
                        server = server.toLowerCase();
                        console.log(g);
                        //if(game=="ffxiv")
                            if(ffServer.indexOf(server)!=-1)
                                return true;//' argument invalide. Sur quelle serveur jouez-vous ?';//invalide server. On which server do you play ?
                            else
                                return false;
                        return false;
                    }
                },{
                    key: 'name',
                    prompt: ' quelle est le nom de votre personnage ?',//what is the name of your character ? \n Q
                    type: 'string',
                    validate: name => {
                        if(!name)
                            return false;//' argument invalide. Quelle est le nom de votre personnage ?';
                        return true;
                    }
                },{
                    key: 'spe',
                    prompt: ' quelle est votre spécialité ? `tank`, `heal` ou `dps`',//what is the name of your character ? \n Q
                    type: 'string',
                    validate: spe => {
                        spe = spe.toLowerCase();
                        if(spe == "tank" || spe == "heal" || spe == "dps" )
                            return true;//' argument invalide. Quelle est le nom de votre personnage ?';
                        return false;
                    }
                },{
                    key: 'ilvl',
                    prompt: ' quelle est le votre ilvl ?',//what is the name of your character ? \n Q
                    type: 'integer',
                    validate: ilvl => {
                        if(!ilvl)
                            return false;//' argument invalide. Quelle est le nom de votre personnage ?';
                        return true;
                    }
                }
            ]
        });
    }

	run(msg, {discorduser, game, server, name, spe, ilvl }){
        var user = msg.mentions.users.first();
        game = game.toLowerCase();
        server = server.toLowerCase();
        name = name.toLowerCase();
		console.log("Command : playeradd, author : " + msg.author.lastMessage.member.nickname + ", arguments : " + game + ", " + server + ", " + name + "," + spe + "," + ilvl);
        add(discorduser, game, server, name, spe, ilvl, msg, user);
        
        //TODO Check valide characters => https://scotch.io
        //if(game == "wow")
        //    return msg.say("https://worldofwarcraft.com/fr-fr/character/" + server + "/" + name);
	}
}