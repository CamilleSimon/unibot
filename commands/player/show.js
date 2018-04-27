const { Command } = require('discord.js-commando');
const fs = require("fs");
const util = require('../general/util');
var MongoClient = require('mongodb').MongoClient;
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);
var url = 'mongodb://' + jsonConfig.mongodb + ':27017/unibot';

//Show the schedule of one player
function onePlayer(name, channel){
	var msg = "";
	var query = {};
	query["discordId"] = util.snowflakeToID(name)
	MongoClient.connect(url, function(err, db) {
	  	if (err) throw err;
	  	db.collection("players").findOne(query, function(err, result) {
	    	if (err) throw err;
	    	if(!result)
	    		channel.say("Error : no user named "+ name + " recorded in the schedule.");
	    	else{
				msg += "**" + util.capsFirstLetter(result["user"]) + "** *" + util.capsFirstLetter(result["nickname"]) + "*```";
				msg += "Game       | Server     | Character            | Spé        | ilvl       \n";
				msg += "-----------+------------+----------------------+------------|------------\n";
				characters = result["characters"];
				for(charIndex in characters){
					character = characters[charIndex];
					for(field in character){
						var temp = util.capsFirstLetter(character[field]);
						if(field != "name")
							var num = 10;
						else
							var num = 20;
						if (temp.length > num)
							msg += temp.substring(0,11);
						else
							msg += temp;
						for(var i = character[field].length; i < num; i++){
							msg += " ";
						}
						if(filed != name)
							msg += " | ";
						else{
							msg += "\n";
						}
					}
				}
		    	channel.say(msg + "```");
	    	}
	    	db.close();
	  	});
	});
}

//Show the schedule of all the players
function all(channel){
	var msg = "";
	var player;
	MongoClient.connect(url, function(err, db) {
	  	if (err) throw err;
	  	db.collection("players").find({}).toArray(function(err, result) {
			if (err) throw err;
	    	for(var i in result){
				msg = "";
	    		player = result[i];
				msg += "**" + util.capsFirstLetter(player["user"]) + "** *" + util.capsFirstLetter(player["nickname"]) + "*```";
				msg += "Game       | Server     | Character\n";
				msg += "-----------+------------+--------------------------\n";
				characters = player["characters"];
				for(charIndex in characters){
					character = characters[charIndex];
					for(field in character){
						var temp = util.capsFirstLetter(character[field]);
						if(field != "name"){
							if (temp.length > 10)
								msg += temp.substring(0,11);
							else
								msg += temp;
							for(var i = character[field].length; i < 10; i++){
								msg += " ";
							}
							msg += " | ";
						}	
						else{
							msg += temp;
							msg += "\n";
						}
					}
				}
				msg += "```";
				channel.say(msg);
	    	}
	    	db.close();
	  	});
	});
}

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'playershow',
            group: 'player',
            memberName: 'playershow',
            description: 'Show a discord user recorded character or all the recorded characters.',
            examples: ['scheduleshow @user'],
            args: [
	            {
	                key: 'discorduser',
	                prompt: ' de quel joueur voulez-vous voir les personnages ?',//whom characters do you want to see ? \n 
	                type: 'string',
	            }
        	]
        });
    }

    run(msg, { discorduser }){
        console.log("Command : playershow, author : " + msg.author.username + ", arguments : "+ discorduser);
    	if(discorduser == "all")
			all(msg);
		else
			onePlayer(discorduser, msg);
	}
}
