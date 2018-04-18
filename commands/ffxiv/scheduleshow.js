const { Command } = require('discord.js-commando');
const util = require('./util');
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/unibot';

//Show today and the next six days of a specific player
function showAllDaysSchedule(channel, name){
	console.log("showAllSchedule");
    MongoClient.connect(url, function(err, db) {
    	if (err) throw err;
    	//Init msg 
    	var msg = "**" + name + "**";
    	   msg += "```Day       | Date  | Schedule\n";
    	      msg += "--------- | ----- | -------------------\n";   
    	//DB connection
	    db.collection('days').find({}).sort({day: 1}).toArray(function(err, result) {
	        if (err) throw err;  
	        //if result exist
	        if(result){
	        	console.log("Result find : ");
	        	console.log(result);
	        	//for each element in result
	        	for(var day in result){
	        		//if there are players recorded on this day
	    			if(result[day].players){
	    				var found = false;
	    				//look over the list of players
	    				for(player in result[day].players){
	    					//if we found the spefific player
	    					if(player == name){
	    						//add to msg the day and the date
	    						msg += util.formalizeDay(util.convertNumToDay(result[day].day.getDay())) + "| " + result[day].day.getDate() + "/" + (result[day].day.getMonth()+1) + " | ";
	    						found = true;
	    						if(result[day].players[player] == "available" || result[day].players[player] == "unavailable")
	    							msg += result[day].players[player] + " all day\n";
	    						else{
	    							msg += util.convertNumToText(result[day].players[player][0]) + "-";
	    							if(result[day].players[player][1] == 48)
										msg += "00:00\n";
									else
										msg += util.convertNumToText(result[day].players[player][1]) + "\n";
	    						}
	    					}
	    				}
	    			}
	    			else
	    				msg += "\n";
	        	}
	        }
	        channel.say(msg + "```");
	        db.close();
	    });
    	
    });
}

//Show today and the next six days of a specific player
function showSevenDaysSchedule(channel, name){
	console.log("showSevenDaysSchedule");
    MongoClient.connect(url, function(err, db) {
    	if (err) throw err;
    	//init msg
    	var msg = "**" + name + "**";
    	   msg += "```Day       | Date  | Schedule\n";
    	      msg += "--------- | ----- | -------------------\n"; 
    	//today is the current day, depend of the day of execution of the script
        var today = new Date();
        today.setDate(today.getDate() - 1);
        console.log(today.toDateString());
        //todayPlusSeven save the date of the end of the week
        var todayPlusSeven = new Date();
        todayPlusSeven.setDate(todayPlusSeven.getDate() + 6);
        console.log(todayPlusSeven.toDateString());
        //db connection
	    db.collection('days').find({ $and: [ {day: {$gte: new Date(today)}}, {day: {$lte: new Date(todayPlusSeven)}}]}).sort({day: 1}).toArray(function(err, result) {
	        if (err) throw err;
	        //if result exist
	        if(result){
	        	console.log("Result find : ");
	        	console.log(result);
	        	var j = 0;
	        	
	        	for(var i = today; i < todayPlusSeven; i.setDate(i.getDate() + 1)){
	        		msg += util.formalizeDay(util.convertNumToDay(i.getDay())) + "| " + i.getDate() + "/" + (i.getMonth()+1) + " | "
	        		if(result[j].day == i){
	        			for(var player in result[j].players){
	        				if(result[j].players[player] == "available" || result[j].players[player] == "unavailable")
	    							msg += result[j].players[player] + " all day\n";
	    						else{
	    							msg += util.convertNumToText(result[j].players[player][0]) + "-";
	    							if(result[j].players[player][1] == 48)
										msg += "00:00\n";
									else
										msg += util.convertNumToText(result[j].players[player][1]) + "\n";
	    						}
	        			}
	        			j++;
	        		}
	        		else{
	        			msg += "\n";
	        		}
	        	}
	        }
	        channel.say(msg + "```");
	        db.close();
	    });
    	
    });
}

//Show one day of a specific player
function showOneDaySchedule(channel, date, name){
	console.log("showOneDaySchedule");
    MongoClient.connect(url, function(err, db) {
    	if (err) throw err;
    	//Initialize begin of message text
    	var msg = "**" + name + "**```Date  | Schedule\n";
    	   msg += "----- | --------\n";
        //Creat date caracters chain
        //Init query
        var query = {};
        query["day"] = date;
	    db.collection('days').findOne(query, function(err, result) {
	        if (err) throw err;
	        if(result){
	        	console.log("Result find : ");
	        	console.log(result);
	        	msg += result.day + " | ";
	        	for(var player in result.players){
	        		if(player == name)
	        			if(result.players[player] == "available" || result.players[player] == "unavailable")
	        				msg += result.players[player] + " all day";
	        			else{
	        				msg += util.convertNumToText(result.players[player][0]) + "-";
	    					if(result.players[player][1] == 48)
								msg += "00:00\n";
							else
								msg += util.convertNumToText(result.players[player][1]) + "\n";
	        			}
	        	}
	        }
	        channel.say(msg + "```");
	        db.close();
	    });
    	
    });
}

//Analyze chat message part
module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'scheduleshow',
            group: 'ffxiv',
            memberName: 'scheduleshow',
            description: 'Show the next 7 days.',
            examples: ['scheduleshow', 'scheduleshow Nyu Mori', 'scheduleshow all Cyber Sardinha', 'scheduleshow 01/05 V\'alrun Dawn'],
            args: [
            	{
            		key: 'range',
            		prompt: '',
            		type: 'string',
            		validate: range => {
            			var date = new Date(util.switchDayMonth(range));
            			if(range == "week" || range == "all")
            				return true;
            			else
            				if(date != 'Invalid Date')
            					return true
            				else
            					return ' invalid argument. Valid argument are `all`, `week` or a date `DD/MM` like `05/01`.'
            		}
            	},
                {
                    key: 'name',
                    prompt: '',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }

	run(msg, { range, name }){
		console.log("Command : scheduleshow, author : " + msg.author.lastMessage.member.nickname + ", arguments : " + name);
        if(!name)
            name = msg.author.lastMessage.member.nickname;
        var date = new Date(util.switchDayMonth(range));
        switch(range){
        	case "all" :
        		showAllDaysSchedule(msg, name);
        		break;
        	case "week" :
        		showSevenDaysSchedule(msg, name);
        		break;
        	default :
        		showOneDaySchedule(msg, range, name);	
        }
	}
}