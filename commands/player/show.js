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
	query["discord-user"] = name;
	MongoClient.connect(url, function(err, db) {
	  	if (err) throw err;
	  	db.collection("players").findOne(query, function(err, result) {
	    	if (err) throw err;
	    	if(!result)
	    		channel.say("Error : no user named "+ name + " recorded in the schedule.");
	    	else{
				for(attr in result){
					if (attr == "discord-user")
						msg += "**" + result[attr] + "**```";
					if (attr == "characters"){
						characters = result[attr];
						for(charIndex in characters){
							character = characters[charIndex];
							console.log(character);
							console.log(server.members.get("id", name))
							/*time = result[attr][day];
							if(time){
								if(time == "available" || time == "unavailable")
									msg += util.formalizeDay(day) + " : " + time + " all day\n";
								else{
									msg += util.formalizeDay(day) + " : " + util.convertNumToText(time[0]) + "-";
									if(time[1] == 48)
										msg += "00:00\n";
									else
										msg += util.convertNumToText(time[1]) + "\n";
								}
							}
							else
								msg += util.formalizeDay(day) + " : \n";*/
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
	  	db.collection("users").find({}).toArray(function(err, result) {
	    	if (err) throw err;
	    	for(var i in result){
	    		player = result[i];
				for(attr in player){
					if (attr == "name")
						msg += "**" + player[attr] + "**```";
					if (attr == "schedule"){
						schedule = player[attr];
						for(day in schedule){
							time = player[attr][day];
							if(time){
								if(time == "available" || time == "unavailable")
									msg += util.formalizeDay(day) + " : " + time + " all day\n";
								else{
									msg += util.formalizeDay(day) + " : " + util.convertNumToText(time[0]) + "-";
									if(time[1] == 48)
										msg += "00:00\n";
									else
										msg += util.convertNumToText(time[1]) + "\n";
								}
							}
							else
								msg += util.formalizeDay(day) + " : \n";
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
	                type: 'String',
	            }
        	]
        });
    }

    run(msg, { discorduser }){
        console.log("Command : playershow, author : " + msg.author.lastMessage.member.nickname + ", arguments : "+ discorduser);
    	if(discorduser == "all" || !discorduser)
    		all(msg);
		onePlayer(discorduser, msg);
	}
}
