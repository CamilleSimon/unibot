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
    for(index in guildMemberArray){
        record = {
            "discordId" : guildMemberArray[index].id,
            "nickname" : guildMemberArray[index].nickname,
            "user" : guildMemberArray[index].user
        }
        records.push(record);
    }

    var query = {};
    MongoClient.connect(url, function(err,db){
        if (err) throw err;
        db.collection("players").insertMany(query, records, function(err,doc) {
            if (err) throw err;
            msg.say("Success : " + doc.insertCount + " players added !s");
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