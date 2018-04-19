const { Command } = require('discord.js-commando');
const fs = require("fs");
const util = require('./util');
var MongoClient = require('mongodb').MongoClient;
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);
var url = 'mongodb:// ' + jsonConfig.mongodb + ':27017/unibot';

/***************************************/
/***************DEPRECATED**************/
/***************************************/

//Remove all time of the author of the message
function clearSchedule(name, channel) {
	var player = findMe(name);
	if(!player)
		return "Error : No player named " + name + " recorded on the schedule.";
	for(var j in player)
		if(j != "name")
			for(var k in player[j])
				player[j][k] = undefined;
	return "Success : " + name + " schedule cleared.";
}

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'scheduleclear',
            group: 'ffxiv',
            memberName: 'scheduleclear',
            description: 'Manages the schedule',
            examples: ['schedule show'],
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
		console.log("Command : " + command + ", author nickname : " + msg.author.lastMessage.member.nickname);
		if(!name)
			clearSchedule(msg.author.lastMessage.member.nickname, msg);
		else
			clearSchedule(name, msg);
	}
}