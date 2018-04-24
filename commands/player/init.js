const { Command } = require('discord.js-commando');
const fs = require("fs");
const util = require('../general/util');
var MongoClient = require('mongodb').MongoClient;
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);
var url = 'mongodb://' + jsonConfig.mongodb + ':27017/unibot';

function init(msg){
    var playersCollection = msg.guild.members.array();
    console.log("hello");
    console.log(playersCollection);
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