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
	var player;
	var query = {};
	query["discordId"] = util.snowflakeToID(name);
	console.log(query);
	MongoClient.connect(url, function(err, db) {
	  	if (err) throw err;
	  	db.collection("players").findOne(query, function(err, result) {
	    	if (err) throw err;
	    	if(!result)
	    		channel.say("Error : no user named "+ name + " recorded in the schedule.");
	    	else{
				msg += "**" + util.capsFirstLetter(result["user"]) + "** *" + util.capsFirstLetter(result["nickname"]) + "*```";
				msg += "Game       | Server     | Character\n";
				msg += "-----------+------------+--------------------------\n";
				characters = result["characters"];
				for(charIndex in characters){
					character = characters[charIndex];
					//console.log(server.members.get("id", name))
					for(field in character){
						var temp = util.capsFirstLetter(character[field]);
						if (temp.length > 10)
							msg += temp.substring(0,11);
						else
							msg += temp;
						for(var i = character[field].length; i < 10; i++){
							msg += " ";
						}
						if(field != "name")
							msg += " | ";
						else
							msg += "\n";
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
			console.log(result);
	    	for(var i in result){
				console.log(result[i]);
	    		player = result[i];
				for(attr in player){
					if (attr == "discord-user"){
						msg += "**" + player[attr] + "**```";
						msg += "Game       | Server     | Character\n";
						msg += "-----------+------------+--------------------------\n";
					}
					if (attr == "characters"){
						characters = player[attr];
						for(charIndex in characters){
							character = characters[charIndex];
							//console.log(server.members.get("id", name))
							for(field in character){
								var temp = util.capsFirstLetter(character[field]);
								if (temp.length > 10)
									msg += temp.substring(0,11);
								else
									msg += temp;
								for(var i = character[field].length; i < 10; i++){
									msg += " ";
								}
								if(field != "name")
									msg += " | ";
								else
									msg += "\n";
							}
						}
					}
				}
				msg += "```";
	    	}
	    	channel.say(msg);
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
	                prompt: ' whom characters do you want to see ? \n De quel joueur voulez-vous voir les personnages ?',
	                type: 'string',
	            }
        	]
        });
    }

    run(msg, { discorduser }){
        console.log("Command : playershow, author : " + msg.author.lastMessage.member.nickname + ", arguments : "+ discorduser);
    	if(discorduser == "all")
			all(msg);
		else
			onePlayer(discorduser, msg);
	}
}
