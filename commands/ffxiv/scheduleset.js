const { Command } = require('discord.js-commando');
const util = require('./util');
var MongoClient = require('mongodb').MongoClient;
var fs = require("fs");
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);

var url = 'mongodb://172.18.0.45:27017/unibot';

//Update one specific day of the schedule
function updateOneDaySchedule(channel, day, time, name){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var query = {};
        query["day"] = day;
        var update = {};
		if(time == "available" || time == "unavailable")
        	update["players." + name] = time;
        else
            update["players." + name] = util.convertTextToNum(time);
        var newValue = { $set: update};
        db.collection('days').updateOne(query, newValue, { upsert: true }, function(err, result) {
            if (err) throw err;
            	console.log(result.result);
            if(result.result.n == 1)
                channel.say("Success : " + name + " schedule at day " + util.convertNumToDay(day.getDay()) + " " + day.getDate() + "/" + (day.getMonth()+1) + " is now "+ time + ".");
            else
                if(result.findCount == 1)
                    channel.say("Error : player named " + name + " not found.");
                else
                    channel.say("Error : " + name + " schedule failed to update.");
            db.close();
        });
    });
}

//Analyze chat message part
module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'scheduleset',
            group: 'ffxiv',
            memberName: 'scheduleset',
            description: 'Set Schedule',
            examples: ['scheduleset Monday 12:00-14:00', 'scheduleset 12/09 12:00-23:00'],
            args: [
                {
                    key: 'day',
                    prompt: ' witch day do you want to modify (Monday,Tuesday...)? You can also use the date `Day/Month` format, example : `05/01`.',
                    type: 'string',
                    validate: day => {
                    	var date = new Date(util.switchDayMonth(day));
                        if (day == "Monday" || 
                            day == "Tuesday" || 
                            day == "Wednesday" || 
                            day == "Thursday" || 
                            day == "Friday" ||
                            day == "Saturday" ||
                            day == "Sunday" ||
                            day == "all" || date != 'Invalid Date'
                        ) 
                            return true;
                        return 'invalid day. Witch day do you want to modify (Monday,Tuesday...)? You can also use the date `Day/Month` format, example : `05/01`.';
                    } 
                },{
                    key: 'time',
                    prompt: ' what\'s the new time ? Please use HH:mm-HH:mm format, example : `20:00-23:00` If you want to said you\'re not vailable use the key word `unavailable`, if you\re available the entire day use the key word `available`',
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
                            else
                                return true;
                        }
                        return ' invalid format. Correct time format are HH:mm-HH:mm format, example `20:00-23:00`. Or `available`, `unavailable`.'
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
        var date = new Date(util.switchDayMonth(day));
        date.setYear(2018);
        if(!name)
            name = msg.author.lastMessage.member.nickname;
            console.log("Command : scheduleset, author : " + msg.author.lastMessage.member.nickname + ", arguments : " + day + ", " + time + ", " + name);
        updateOneDaySchedule(msg, date, time, name);
	}
}