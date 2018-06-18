const { Command } = require('discord.js-commando');
const fs = require("fs");
const discordFct = require('../discordFct');
const wowFct = require('../wow/wowFct');

var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);

var wowapi = jsonConfig.wowapi;
var bnet = require('battlenet-api')(wowapi);

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://' + jsonConfig.mongodb + ':27017/unibot';

var content = fs.readFileSync("commands/wow/color.json");
var colorTab = JSON.parse(content);
content = fs.readFileSync("commands/wow/race.json");
var raceTab = JSON.parse(content);
content = fs.readFileSync("commands/wow/class.json");
var classTab = JSON.parse(content);

var g;
var s;
var c;

function add(discorduser, game, server, name, channel){
    //var id = user.id;
    //query init
    var query = {};
    //the query has to find an discord-user
    query["discordId"] = discordFct.snowflakeToID(discorduser);
    //the new character to add
    var character = {
        "game" : game,
        "server" : server,
        "name" : name,
    };
    //connection to the DB
    MongoClient.connect(url, function(err,db){
        if (err) throw err;
        //add to the end the array 'characters' the element 'character'
        var newValue = { $addToSet: {"characters": character}};//$set: { "user": user }};
        db.collection("players").updateOne(query, newValue, {upsert: true}, function(err,doc) {
            if (err) throw err;
            discordFct.successMsg("Le personnage " + name + " a bien été ajouté à l'utilisateur " + discorduser + " !", channel);
            db.close();
        });
    });
}

//Analyze chat message part
module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'useradd',
            group: 'wow',
            memberName: 'useradd',
            description: 'Add a player in the database \n Ajoute un joueur à la base de données',
            examples: ['playeradd @user wow uldaman Shaykan', 'playeradd @user ffxiv shiva Nyu Mori'],
            args: [
                {
                    key: 'discorduser',
                    prompt: ' à quelle utilisateur discord voulez vous ajouter ce personnage ?',//to which discord user do you want to add this character ? \n 
                    type: 'string',
                    validate: discorduser =>{
                        if(!discorduser || discordFct.isSnowflake(discorduser)==false)
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
                    prompt: ' sur quelle serveur jouez-vous ?',//on which server do you play ? \n S
                    type: 'string',
                    validate: server => {
                        s = server;
                        return true;
                    }
                },{
                    key: 'name',
                    prompt: ' quelle est le nom de votre personnage ?',//what is the name of your character ? \n Q
                    type: 'string',
                    validate: name => {
                        if(!name)
                            return false;//' argument invalide. Quelle est le nom de votre personnage ?';
                        else {
                            var r = {origin: 'eu', locale : 'fr_FR', realm: '', name:'', fields: ['talents', 'items']};
                            r['realm'] = s;
                            r['name'] = name;
                            bnet.wow.character.aggregate(r, function(error, response, body) {
                                console.log(response);
                                console.log(body);
                                if(response.status!="undefined" && response.status!="nok"){
                                    wowFct.profile(s,name,client.channels.find('id','443679878685130762'),"send");
                                    return true;
                                }
                                return false;
                            });
                            return true;
                        }
                    }
                },{
                    key: 'isItYours',
                    prompt: ' s\'agit-il de votre personnage ? `oui` `non`',//what is the name of your character ? \n Q
                    type: 'string',
                    wait: 30,
                    validate: isItYours => {
                        if(isItYours == "oui" || isItYours == "non")
                            return true;
                        else
                            return false;
                    }
                }
            ]
        });
    }

	run(msg, {discorduser, game, server, name, isItYours}){
        if(isItYours=="non")
            discordFct.interrogationMsg("Le personnage " + name + " n\'a pas été attaché à l'utilisateur " + discorduser, msg);
        else{
            game = game.toLowerCase();
            server = server.toLowerCase();
            name = name.toLowerCase();
            console.log("Command : playeradd, author : " + msg.author.lastMessage.member.nickname + ", arguments : " + game + ", " + server + ", " + name);
            add(discorduser, game, server, name, msg);
        }
	}
}