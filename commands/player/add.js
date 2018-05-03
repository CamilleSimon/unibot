const { Command } = require('discord.js-commando');
const fs = require("fs");
const util = require('../general/util');

var MongoClient = require('mongodb').MongoClient;
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);
var url = 'mongodb://' + jsonConfig.mongodb + ':27017/unibot';

var wowServers = new Array("aegwynn", "aerie peak", "agamaggan", "aggra", "aggramar", "ahn'qiraj", "al'akir", "alexstrasza", "alleria", "alonsus", "aman'thul", "ambossar", "anachronos", "anetheron", "antonidas", "anub'arak", "arak-arahm", "arathi", "arathor", "archimonde", "area 52", "argent dawn", "arthas", "arygos", "ashenvale", "aszune", "auchindoun", "azjol-nerub", "azshara", "azuregos", "azuremyst", "baelgun", "balnazzar", "blackhand", "blackmoore", "blackrock", "blackscar", "blade's edge", "bladefist", "bloodfeather", "bloodhoof", "bloodscalp", "blutkessel", "booty bay", "borean tundra", "boulderfist", "bronze dragonflight", "bronzebeard", "burning blade", "burning legion", "burning steppes", "c'thun", "chamber of aspects", "chants éternels", "cho’gall", "chromaggus", "colinas pardas", "confrérie du thorium", "conseil des ombres", "crushridgeculte de la rive noire", "daggerspine", "dalaran", "dalvengyr", "darkmoon faire", "darksorrow", "darkspear", "das konsortium", "das syndikat", "deathguard", "deathweaver", "deathwing", "deephome", "defias brotherhood", "dentarg", "der mithrilorden", "der rat von dalaran", "der abyssische rat", "destromath", "dethecus", "die aldor", "die nachtwache", "die silberne hand", "die todeskrallen", "die ewige wacht", "doomhammer", "draenor", "dragonblight", "dragonmaw", "drak'thul", "drek'thar", "dun modr", "dun morogh", "dunemaul", "durotan", "earthen ring", "echsenkessel", "eitrigg", "eldre'thalas", "elune", "emerald dream", "emeriss", "eonar", "eredar", "eversong", "executus", "exodar", "festung der stürme", "fordragon", "forscherliga", "frostmane", "frostmourne", "frostwhisper", "frostwolf", "galakrond", "garona", "garrosh", "genjuros", "ghostlands", "gilneas", "goldrinn", "gordunni", "gorgonnash", "greymane", "grim batol", "grom", "gul’dan", "hakkar", "haomarush", "hellfire", "hellscream", "howling fjord", "hyjal", "illidan", "jaedenar", "kael'thas", "karazhan", "kargath", "kazzak", "kel'thuzad", "khadgar", "khaz modan", "khaz'goroth", "kil'jaeden", "kilrogg", "kirin tor", "kor'gall", "krag'jin", "krasus", "kul tiras", "kult der verdammten", "la croisade écarlate", "la veille d'argus", "laughing skull", "les clairvoyants", "les sentinelles", "lich king", "lightbringer", "lightning's blade", "lordaeron", "los errantes", "lothar", "légion du bouclier balafré", "madmortem", "magtheridon", "mal'ganis", "malfurion", "malorne", "malygos", "mannoroth", "marécage de zangar", "mazrigos", "medivh", "minahonda", "moonglade", "mug'thol", "nagrand", "nathrezim", "naxxramas", "nazjatar", "nefarian", "nemesis", "neptulon", "nera'thor", "ner’zhul", "nethersturm", "nordrassil", "norgannon", "nozdormu", "onyxia", "outland", "perenolde", "pozzo dell'eternità", "proudmoore", "quel'thalas", "ragnaros", "rajaxx", "rashgarroth", "ravencrest", "ravenholdt", "razuvious", "rexxar", "runetotem", "sanguino", "sargeras", "saurfang", "sen'jin", "shadowsong", "shattered halls", "shattered hand", "shattrath", "shen'dralar", "silvermoon", "sinstralis", "skullcrusher", "soulflayer", "spinebreaker", "sporeggar", "steamwheedle cartel", "stormrage", "stormreaver", "stormscale", "sunstrider", "suramar", "sylvanas", "taerar", "talnivarr", "tarren mill", "teldrassil", "temple noir", "terenas", "terokkar", "terrordar", "the maelstrom", "the sha'tar", "the venture co", "theradras", "thermaplugg", "thrall", "throk'feroth", "thunderhorn", "tichondrius", "tirion", "todeswache", "trollbane", "turalyon", "twilight's hammer", "twisting nether", "tyrande", "uldaman", "ulduar", "uldum", "un'goro", "varimathras", "vashj", "vek'lor", "vek'nilash", "vol'jin", "wildhammer", "wrathbringer", "xavius", "ysera", "ysondre", "zenedar", "zirkel des cenarius", "zul'jin", "zuluhed");
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
                        if((g=="ffxiv" && ffServers.indexOf(server)!=-1) || (g=="wow" && wowServers.indexOf(server)!=-1))
                            return true;//' argument invalide. Sur quelle serveur jouez-vous ?';//invalide server. On which server do you play ?
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