const { Command } = require('discord.js-commando');
const fs = require("fs");
const util = require('../general/util');
var MongoClient = require('mongodb').MongoClient;
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);
var url = 'mongodb://' + jsonConfig.mongodb + ':27017/unibot';

function init(msg){
    var guildMemberArray = msg.guild.members.array();
    var records = new Array();
    var record;
    for(guildMember in guildMemberArray){
        record = {
            "discordId" : guildMember.id,
            "nickname" : guildMember.nickname,
            "user" : guildMember.user
        }
        records.push(record);
    }
    console.log(records);

    MongoClient.connect(url, function(err,db){
        if (err) throw err;
        db.collection("players").insertMany(newValue, function(err,doc) {
            if (err) throw err;
            msg.say("Success : " + res.insertCount + " players added !s");
            db.close();
        });
    });
    return true;
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
		init(msg);
	}
}