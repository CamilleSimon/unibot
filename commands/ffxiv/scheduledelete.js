const { Command } = require('discord.js-commando');
const fs = require("fs");
const util = require('./util');
var MongoClient = require('mongodb').MongoClient;
var configs = fs.readFileSync("config.json");
var jsonConfig = JSON.parse(configs);
var url = 'mongodb:// ' + jsonConfig.mongodb + ':27017/unibot';

//Delete a user selected by his name from the DB
function scheduleDelete(name, channel){
    //Query creation
    var query = {};
    query["name"] = name;
    //Connection to the database
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        //Delete in database
        db.collection("users").deleteOne(query, function(err, result) {
            if (err) throw err;
            if (result.deletedCount == 1) 
                channel.say("Success : player " + name + " deleted from the schedule.");
            else 
                channel.say("Error : no player named " + name + " in the schedule.");
        });
    db.close();
  });
}

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
        name: 'scheduledelete',
        group: 'ffxiv',
        memberName: 'scheduledelete',
        description: 'Deletes a player from the schedule.',
        examples: ['scheduledelete Nyu Mori'],
        args: [
            {
                key: 'name',
                prompt: 'Nickname of the Player to delete',
                type: 'string',
                default : ''
            }
        ]
    });
  }

    run(msg, { name } ) {
        console.log("Command : scheduledelete, author : " + msg.author.lastMessage.member.nickname + ", arguments : "+ name);
        if(!name)
            scheduleDelete(msg.author.lastMessage.member.nickname, msg);
        else{
            scheduleDelete(name, msg);
        }
    }
}
