const { Command } = require('discord.js-commando');
const fs = require('fs');
const util = require('./util');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/unibot';

function updateOneDaySchedule(channel, day, time, name){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var query = {};
        query["name"] = name;
        var update = {};
        if(time == "available" || time == "unavailable")
            update["schedule." + day] = time;
        else
            update["schedule." + day] = util.convertTextToNum(time);
        var newValue = { $set: update};
        db.collection('users').updateOne(query, newValue, function(err, result) {
            if (err) throw err;
            if(result.modifiedCount == 1)
                channel.say("Success : " + name + " schedule at day " + day + " is now "+ time + ".");
            else
                if(result.findCount == 1)
                    channel.say("Error : player named " + name + " not found.");
                else
                    channel.say("Error : " + name + " schedule failed to update.");
            db.close();
        });
    });
}

function updateAllDaySchedule(channel, time, name){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var query = {};
        query["name"] = name;
        var update = {};
        if(time == "available" || time == "unavailable")
            var newSchedule = {
                "Tuesday" : time,
                "Wednesday" : time,
                "Thursday" : time,
                "Friday" : time,
                "Saturday" : time,
                "Sunday" : time,
                "Monday" : time,
            }
        else
           var newSchedule = {
                "Tuesday" : util.convertTextToNum(time),
                "Wednesday" : util.convertTextToNum(time),
                "Thursday" : util.convertTextToNum(time),
                "Friday" : util.convertTextToNum(time),
                "Saturday" : util.convertTextToNum(time),
                "Sunday" : util.convertTextToNum(time),
                "Monday" : util.convertTextToNum(time)
            } 
        update["schedule"] = newSchedule;
        var newValue = { $set: update};
        db.collection('users').updateOne(query, newValue, function(err, result) {
            if (err) throw err;
            if(result.modifiedCount == 1)
                channel.say("Success : " + name + " schedule for all days is now "+ time + ".");
            else
                if(result.findCount == 1)
                    channel.say("Error : player named " + name + " not found.");
                else
                    channel.say("Error : " + name + " schedule failed to update.");
            db.close();
        });
    });
}

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'scheduleset',
            group: 'ffxiv',
            memberName: 'scheduleset',
            description: 'Set Schedule',
            examples: ['scheduleset Monday 12:00-14:00'],
            args: [
                {
                    key: 'day',
                    prompt: 'Witch day do you want to modify (Monday,Tuesday...)? If you want to modify all day time `all`.',
                    type: 'string',
                    validate: day => {
                        if (day == "Monday" || 
                            day == "Tuesday" || 
                            day == "Wednesday" || 
                            day == "Thursday" || 
                            day == "Friday" ||
                            day == "Saturday" ||
                            day == "Sunday" ||
                            day == "all"
                        ) 
                            return true;
                        return 'Invalid day, please be sure to use a capital for the first letter of the day or `all` for all days.';
                    } 
                },{
                    key: 'time',
                    prompt: 'What\'s the new time ? Please use HH:mm-HH:mm format, example : `20:00-23:00` If you want to said you\'re not vailable use the key word `unavailable`, if you\re available the entire day use the key word `available`',
                    type: 'string',
                    validate: time => {
                        var re = new RegExp('[0-2][0-9]:[0|3]0-[0-2][0-9]:[0|3]0', 'g');
                        if (time.match(re) || time == "available" || time == "unavailable"){
                            if(time != "available" && time != "unavailable"){
                                var nums = util.convertTextToNum(time);
                                if(nums[1] < nums[0])
                                    return 'Invalid time. The end time can\'t be smaller than the begin time. Expect if end time is `00:00`.'
                                return true;
                            }
                        }
                        return 'Invalid format. Correct time format are HH:mm-HH:mm format, example `20:00-23:00`. Or `available`, `unavailable`.'
                    }
                },{
                    key: 'name',
                    prompt: '',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }

	run(msg, { day, time, name }){
		console.log("Command : scheduleset, author : " + msg.author.lastMessage.member.nickname + ", arguments : " + day + ", " + time + ", " + name);
        var name;
        if(!name)
            name = msg.author.lastMessage.member.nickname;
        if(day == "all")
            updateAllDaySchedule(msg, time, name);
        else
            updateOneDaySchedule(msg, day, time, name);
	}
}
