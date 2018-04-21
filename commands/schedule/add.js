const { Command } = require('discord.js-commando');
const fs = require("fs");
const util = require('../general/util');
var MongoClient = require('mongodb').MongoClient;
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);
var url = 'mongodb://' + jsonConfig.mongodb + ':27017/unibot';

//Add the author of the message to the schedule
function addSchedule(name, channel){
	var query = {};
	query["name"] = name;
	var player = {
		"name" : name,
		"schedule" : {
			"Tuesday" : undefined,
			"Wednesday" : undefined,
			"Thursday" : undefined,
			"Friday" : undefined,
			"Saturday" : undefined,
			"Sunday" : undefined,
            "Monday" : undefined
		}
	};
	MongoClient.connect(url, function(err,db){
   		if (err) throw err;
     	db.collection("users").findOneAndUpdate(query, player, {upsert: true}, function(err,doc) {
       		if (err) throw err;
			channel.say("Success : player " + name + " added to schedule.");
			db.close();
     	});
 	});
}

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'scheduleadd',
            group: 'schedule',
            memberName: 'scheduleadd',
            description: 'Add a player to the schedule.',
            examples: ['scheduleadd Nyu Mori'],
            args: [
                {
                    key: 'name',
                    prompt: 'Player Name',
                    type: 'string',
                    default : ''
                }
            ]
        });
    }

    run(msg, { name }){
    	console.log("Command : scheduleadd, author : " + msg.author.lastMessage.member.nickname + ", arguments : "+ name);
    	if(!name)
    		addSchedule(msg.author.lastMessage.member.nickname, msg)
    	else{
			addSchedule(name, msg)
    	}
	}
}
