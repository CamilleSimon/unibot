const { Command } = require('discord.js-commando');
const fs = require("fs");
const util = require('../general/util');

var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://' + jsonConfig.mongodb + ':27017/unibot';

//Analyze chat message part
module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'profile',
            group: 'wow',
            memberName: 'profile',
            description: 'Affiche les informartions basiques sur un personnage',
            examples: ['!profile @user', '!profile Shaykan'],
            args: [
                {
                    key: 'character',
                    prompt: ' quel est l\'utilisateur dont vous souhaitez voir le(s) personnage(s) ?',
                    type: 'user',
                    validate: discoruser =>{
                        if(!discoruser)
                            return ' argument invalide. Quel est l\'utilisateur dont vous souhaitez voir le(s) personnage(s) ?';
                        return true;
                    }
                }
            ]
        });
    }

	run(msg, {character}){
        var user = msg.mentions.users.first();
		console.log("Command : wowprofile, author : " + msg.author.lastMessage.member.nickname + ", arguments : " + character + ", " + user);
        //set(discorduser, type, old, replace, msg, user);
	}
}