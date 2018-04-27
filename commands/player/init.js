const { Command } = require('discord.js-commando');
const fs = require("fs");
const util = require('../general/util');
var MongoClient = require('mongodb').MongoClient;
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);
var url = 'mongodb://' + jsonConfig.mongodb + ':27017/unibot';

function init(msg){
    MongoClient.connect(url, function(err,db){
        if (err) throw err;
        db.collection("players").deleteMany({}, {safe:true}, function(err,doc) {
            if(err) throw err;
            console.log(doc.result.n + " document(s) deleted");
            db.close();
        });

        var guildMemberArray = msg.guild.members.array();
        var records = new Array();
        var record;
        for(index in guildMemberArray){
            record = {
                "discordId" : guildMemberArray[index].id,
                "nickname" : guildMemberArray[index].nickname,
                "user" : guildMemberArray[index].user.username
            }
            records.push(record);
        }

        db.collection("players").insertMany(records, {safe:true}, function(err,doc) {
            if (err) throw err;
            console.log("Number of documents inserted: " + doc.insertCount);
            db.close();
        });
    return true;
    });
}

//Analyze chat message part
module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'init',
            group: 'player',
            memberName: 'init',
            description: '',
            examples: ['']
        });
    }

	run(msg){
        console.log(msg.author.lastMessage.member.id);
        if(msg.author.lastMessage.member.id == "71312098952486912")
            init(msg);
        else{
            msg.say("You don't have the permission to use this command. Jerk.");
        }
	}
}