const { Command } = require('discord.js-commando');
const fs = require("fs");

var schedules = [
	{
		"name" : "Nyu Mori",
		"schedule" : {
			"Monday" : [45,47],
			"Tuesday" : [40,44],
			"Wednesday" : [40,44],
			"Thursday" : [40,44],
			"Friday" : [40,44],
			"Saturday" : [40,44],
			"Sunday" : [40,44]
		}
	},
	{
		"name" : "Cyber Sardinha",
		"schedule" : {
			"Monday" : [38,47],
			"Tuesday" : [38,42],
			"Wednesday" : [38,42],
			"Thursday" : [38,42],
			"Friday" : [38,42],
			"Saturday" : [38,42],
			"Sunday" : [38,42]
		}
	}
];

/**
 * Utilities functions
 */
//And, i propose an alternativ to convertWeekDay
function formalizeDay(day){
	//The longest day is 'Wednesday'and it have 9 letters
	//I choose to add space to 'day' until it size 9 caracters
	for(var i = day.length; i < 10; i++)
		day += " ";
	return day;
}

//Convert the number in the schedules variable as a time understandable by a human.
function convertNumToText(num){
	var msg = "";
	var h = Math.trunc(num/2);
	if(h < 10)
		msg += "0" + h + ":";
	else
		msg += h + ":";
	if((num/2 - h) != 0)
		return msg + "30";
	else
		return msg + "00";
}

//Convert the number in the schedules variable as a time understandable by a human.
function convertTextToNum(text){
	if(!text)
		return undefined;
	var tabular = new Array();
	//i for initial
	var i = Number(text.substring(0,2))*2;
	var im = Number(text.substring(3,5));
	//e for end
	var e = Number(text.substring(6,8))*2;
	var em = Number(text.substring(9,11));
	if(im == 30)
		i++;
	tabular.push(i);
	if(em == 30)
		e++;
	tabular.push(e);
	return tabular
}

//Find a specific player in the schedule with his firstName and surname
function findMe(name){
	var i = 0;
	var player;
	while(i < schedules.length){
		player = schedules[i];
		if(player.name == name)
			return player;
		else
			i++;
	}
	return undefined;
}

//Show the schedule of all the players
function showSchedule(){
	var msg = "";
	var player;
	var attr;
	var time;
	for(var i in schedules){
		player = schedules[i];
		for(attr in player){
			if (attr == "name")
				msg += "**" + player[attr] + "**```";
			else{
				schedule = player[attr];
				for(day in schedule){
					time = player[attr][day]
					if(time)
						msg += formalizeDay(day) + " : " + convertNumToText(time[0]) + "-" + convertNumToText(time[1]) + "\n";
					else
						msg += formalizeDay(day) + " : \n";
				}
			}
		}
		msg += "```";
	}
	return msg;
}

//Show the schedule of the author of the message
function showMySchedule(name){
	var msg = "";
	var player = findMe(name);
	if(!player)
		return "Error : You are not recorded on the schedule.";
	var attr;
	var time;
	for(attr in player){
		if (attr == "name")
			msg += "**" + player[attr] + "**```";
		else{
			schedule = player[attr];
			for(day in schedule){
				time = player[attr][day]
				if(time)
					msg += formalizeDay(day) + " : " + convertNumToText(time[0]) + "-" + convertNumToText(time[1]) + "\n";
				else
					msg += formalizeDay(day) + " : \n";
			}
		}
	}
	return msg + "```";
}

//Add the author of the message to the schedule
function addMeSchedule(name){
	var player = findMe(name);
	if(player)
		return "Error : There are already a player named " + name + " recorded on the schedule.";
	var player = {
		"name" : name,
		"schedule" : {
			"Monday" : undefined,
			"Tuesday" : undefined,
			"Wednesday" : undefined,
			"Thursday" : undefined,
			"Friday" : undefined,
			"Saturday" : undefined,
			"Sunday" : undefined
		}
	};
	schedule.push(player);
	return "Success : " + name + " added to the schedule.";
}

//Remove all time of the author of the message
function clearMySchedule(name) {
	var player = findMe(name);
	if(!player)
		return "Error : No player named " + name + " recorded on the schedule.";
	for(var j in player)
		if(j != "name")
			for(var k in player[j])
				player[j][k] = undefined;
	return "Success : " + name + " schedule cleared.";
}

//Set the time of a specific day for a specific player
function setMyTime(name, day, time){
	var player = findMe(name);
	if(!player)
		return "Error : No player named " + name + " recorded on the schedule.";
	if(day != "all")
		for(var j in player.schedule)
			if(j == day){
				player.schedule[j] = convertTextToNum(time);
				return "Success : The schedule for " + name + " at " + day +" is now " + time + ".";
			}
	for(var j in player.schedule)
		player.schedule[j] = convertTextToNum(time);
	return "Success : The schedule for " + name + " for " + day +" days is now " + time + ".";

}

//Initialize the schedule tab
function initSchedule(){
	scheduleTab = new Array(7);
	earliestHour = 0;
}

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'schedule',
            group: 'ffxiv',
            memberName: 'schedule',
            description: 'Manages the schedule',
            examples: ['schedule show'],
            args: [
                {
                    key: 'command',
                    prompt: 'Correct commands are : `clear` | `show` | `add` | `set`',
                    type: 'string',
					default: ''
                },{
                    key: 'day',
                    prompt: 'Witch day do you want to modify ?',
                    type: 'string',
					default: ''
                },{
                    key: 'time',
                    prompt: 'What\'s the new time ? Please use HH:mm-HH:mm format, example : ```20:00-23:00```.\n If you want to clear your time for this day, ```cancel``` the command.',
                    type: 'string',
					default: ''
                }
            ]
        });
    }

	run(msg, { command, day, time }){
		console.log("Command : " + command + ", author nickname : " + msg.author.lastMessage.member.nickname);
		if(!command)
			return msg.say(showSchedule());
		switch(command){
			case 'clear' :
				return msg.say(clearMySchedule(msg.author.lastMessage.member.nickname));
				break;
			case 'show' :
				return msg.say(showMySchedule(msg.author.lastMessage.member.nickname));
				break;
			case 'add' :
				return msg.say(addMeSchedule(msg.author.lastMessage.member.nickname));
				break;
			case 'set' :
				return msg.say(setMyTime(msg.author.lastMessage.member.nickname, day, time));
				break;
		}
	}
}
