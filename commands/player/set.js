const { Command } = require('discord.js-commando');
const fs = require("fs");
const util = require('../general/util');
var MongoClient = require('mongodb').MongoClient;
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);
var url = 'mongodb://' + jsonConfig.mongodb + ':27017/unibot';

function set(discorduser, type, old, replace, msg, user){
    var msg = "";
	var query = {};
	query["discordId"] = util.snowflakeToID(name);
	MongoClient.connect(url, function(err, db) {
	  	if (err) throw err;
	  	db.collection("players").findOne(query, function(err, result) {
	    	if (err) throw err;
	    	if(!result)
	    		channel.say("Error : no user named "+ name + " recorded in the schedule.");
	    	else{

            }
        });
    });
}

//Analyze chat message part
module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'playerset',
            group: 'player',
            memberName: 'playerset',
            description: '\n Set a player in the database \n Modifie un joueur dans la base de données',
            examples: ['playerset @user server uldman uldaman', 'playerset @user character shyakan shaykan'],
            args: [
                {
                    key: 'discorduser',
                    prompt: ' de quelle utilisateur discord souhaitez vous modifier les informations ?',
                    type: 'string',
                    validate: discoruser =>{
                        if(!discoruser)
                            return ' argument invalide. De quelle utilisateur discord souahitez vous modifier les informations ?';
                        return true;
                    }
                },{
                    key: 'type',
                    prompt: ' quelle info voulez vous modifier ? \n `server`, `name`',
                    type: 'string',
                    validate: type => {
                        type = type.toLowerCase();
                        if (type == "server" ||
                            type == "name"
                        ) 
                            return true;
                        return 'invalid info. Witch type of info do you want to modify ? \n Quelle info voulez vous modifier ? \n `game`, `server`, `name`';
                    } 
                },{
                    key: 'old',
                    prompt: ' what is the current info ? \n Quelle est l\'info actuelle ?',
                    type: 'string',
                    validate: old => {
                        if(!old)
                            ' invalide data. What is the current info ? \n Quelle est l\'info actuelle ?';
                        return true;
                    }
                },{
                    key: 'replace',
                    prompt: ' what is the new info to replace by ? \n Quelle est la nouvelle info que vous souhaitez indérer ?',
                    type: 'string',
                    validate: replace => {
                        if(!replace)
                            return ' invalide name. What is the new info to replace by ? \n Quelle est la nouvelle info que vous souhaitez indérer ?';
                        return true;
                    }
                }
            ]
        });
    }

	run(msg, {discorduser, type, old, replace }){
        var user = msg.mentions.users.first();
        type = type.toLowerCase();
        old = old.toLowerCase();
        replace = replace.toLowerCase();
		console.log("Command : playeradd, author : " + msg.author.lastMessage.member.nickname + ", arguments : " + type + ", " + old + ", " + replace);
        set(discorduser, type, old, replace, msg, user);
	}
}