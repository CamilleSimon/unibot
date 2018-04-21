const { Command } = require('discord.js-commando');
const fs = require("fs");
const util = require('./util');
var MongoClient = require('mongodb').MongoClient;
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);
var url = 'mongodb://' + jsonConfig.mongodb + ':27017/unibot';
var scheduleTable;

function startTime(day, pos){
	var t = 0;
	for(var time in day)
		if(day[time] != null && day[time] != "available"){
			if(day[time][pos] == 0)
				day[time][pos] = 48;
			if(day[time][pos] > t)
				t = day[time][pos];
		}
	return t;
}

function endTime(day, pos){
	var t = 48;
	for(var time in day)
		if(day[time] != null && day[time] != "available"){
			if(day[time][pos] == 0)
				day[time][pos] = 48;
			if(day[time][pos] < t)
				t = day[time][pos];
		}
	return t;
}

function setUpSchedule(channel){
	MongoClient.connect(url, function(err, db) {
		var msg = "@everyone **Temporary sessions for 7/11 to 13/11 Server Time**```Day       | Session       | Content\n";
		      msg += "--------- | ------------- | ---------------\n";
		var player;
	  	if (err) throw err;
	  	db.collection("users").find({}).toArray(function(err, result) {
	  		var tuesday = [];
	  		var wednesday = [];
	  		var thursday = [];
	  		var friday = [];
	  		var saturday = [];
	  		var sunday = [];
	  		var monday = [];
	    	if (err) throw err;
	    	for(var i in result){
	    		player = result[i];
				tuesday.push(player["schedule"]["Tuesday"]);
				wednesday.push(player["schedule"]["Wednesday"]);
				thursday.push(player["schedule"]["Thursday"]);
				friday.push(player["schedule"]["Friday"]);
				saturday.push(player["schedule"]["Saturday"]);
				sunday.push(player["schedule"]["Sunday"]);
				monday.push(player["schedule"]["Monday"]);
			}
			console.log(util.containUnavailable(wednesday));
			if(!util.containUnavailable(tuesday)){
				//console.log(tuesday);
				var begin = startTime(tuesday, 0);
				var end = endTime(tuesday, 1);
				//console.log("Begin of session : " + begin + ", end of the session : " + end);
				msg += "Tuesday   | " + util.convertNumToText(begin) + " / " + util.convertNumToText(end) + " | \n";
			}
			if(!util.containUnavailable(wednesday)){
				//console.log(wednesday);
				var begin = startTime(wednesday, 0);
				var end = endTime(wednesday, 1);
				//console.log("Begin of session : " + begin + ", end of the session : " + end);
				msg += "Wednesday | " + util.convertNumToText(begin) + " / " + util.convertNumToText(end) + " | \n";
			}
			if(!util.containUnavailable(thursday)){
				//console.log(thursday);
				var begin = startTime(thursday, 0);
				var end = endTime(thursday, 1);
				//console.log("Begin of session : " + begin + ", end of the session : " + end);
				msg += "Thursday  | " + util.convertNumToText(begin) + " / " + util.convertNumToText(end) + " | \n";
			}
			if(!util.containUnavailable(friday)){
				//console.log(friday);
				var begin = startTime(friday, 0);
				var end = endTime(friday, 1);
				//console.log("Begin of session : " + begin + ", end of the session : " + end);
				msg += "Friday    | " + util.convertNumToText(begin) + " / " + util.convertNumToText(end) + " | \n";
			}
			if(!util.containUnavailable(saturday)){
				//console.log(saturday);
				var begin = startTime(saturday, 0);
				var end = endTime(saturday, 1);
				//console.log("Begin of session : " + begin + ", end of the session : " + end);
				msg += "Saturday  | " + util.convertNumToText(begin) + " / " + util.convertNumToText(end) + " | \n";
			}
			if(!util.containUnavailable(sunday)){
				//console.log(sunday);
				var begin = startTime(sunday, 0);
				var end = endTime(sunday, 1);
				//console.log("Begin of session : " + begin + ", end of the session : " + end);
				msg += "Sunday    | " + util.convertNumToText(begin) + " / " + util.convertNumToText(end) + " | \n";
			}
			if(!util.containUnavailable(monday)){
				//console.log(monday);
				var begin = startTime(monday, 0);
				var end = endTime(monday, 1);
				//console.log("Begin of session : " + begin + ", end of the session : " + end);
				msg += "Monday    | " + util.convertNumToText(begin) + " / " + util.convertNumToText(end) + " | \n";
			}
	    	channel.say(msg+"```");
	    	db.close();
	  	});
	});
}

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'schedule',
            group: 'ffxiv',
            memberName: 'schedule',
            description: 'Show the entire schedule of all the players.',
            examples: ['schedule']
        });
    }

	run(msg){
		console.log("Command : schedule, author : " + msg.author.lastMessage.member.nickname);
		setUpSchedule(msg);
	}
}
