const { Command } = require('discord.js-commando');
const fs = require("fs");
const util = require('./util');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/unibot';

//Show the schedule of the author of the message
function showPlayerSchedule(name, channel){
	var msg = "";
	var player;
	var query = {};
	query["name"] = name;
	MongoClient.connect(url, function(err, db) {
	  	if (err) throw err;
	  	db.collection("users").findOne(query, function(err, result) {
	    	if (err) throw err;
	    	console.log(result);
	    	if(!result)
	    		channel.say("Error : no player named "+ name + " recorded in the schedule.");
	    	else{
				for(attr in result){
					if (attr == "name")
						msg += "**" + result[attr] + "**```";
					if (attr == "schedule"){
						schedule = result[attr];
						for(day in schedule){
							time = result[attr][day];
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
		    	channel.say(msg + "```");
	    	}
	    	db.close();
	  	});
	});
}

//Show the schedule of all the players
function showSchedule(channel){
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
            name: 'scheduleshow',
            group: 'ffxiv',
            memberName: 'scheduleshow',
            description: 'Show the author of the command schedule. Add the name of a person for seeing his schedule.',
            examples: ['scheduleshow Nyu Mori'],
            args: [
	            {
	                key: 'name',
	                prompt: 'Nickname of the Player to delete',
	                type: 'string',
	                default : ''
	            }
        	]
        });
    }

    run(msg, { name }){
    	console.log("Command : scheduleshow, author : " + msg.author.lastMessage.member.nickname + ", arguments : "+ name);
    	if(name == "all")
    		showSchedule(msg);
    	else if(!name)
			showPlayerSchedule(msg.author.lastMessage.member.nickname, msg);
		else{
			showPlayerSchedule(name, msg);
		}
	}
}
