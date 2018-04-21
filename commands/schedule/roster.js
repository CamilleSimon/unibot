const { Command } = require('discord.js-commando');
const fs = require("fs");

//Declaration roster object
/*var roster = {
	"datetime": "",
	"tanks": ["", ""],
	"healers": ["", ""],
	"dps": ["", "", "", ""],
	"content": ""
}*/

var currentRoster;// = JSON.parse(JSON.stringify(roster));
//var currentRoster = require('./roster.json');

/**
 * Utilities functions
 */
function clearRoster(message) {
	currentRoster.datetime = currentRoster.tanks[0] =
	currentRoster.tanks[1] = currentRoster.healers[0] =
	currentRoster.healers[1] = currentRoster.dps[0] =
	currentRoster.dps[1] = currentRoster.dps[2] =
	currentRoster.dps[3] = currentRoster.content = "";
	message.channel.send("Success : Roster is cleared.");
}

/**
 * Add Roster functions
 */
function addDateRoster(message) {
	var content = fs.readFileSync("../../rosterFile.json");
	currentRoster = JSON.parse(content);
	currentRoster.date = new Date(temp);
	message.channel.send("Success : date for the next raid is now " + currentRoster.date + ".");	
}

function addTankRoster(message) {
	var added = false;
	var i = 0;
	while(added == false && i < 2){
		if(currentRoster.tanks[i] === undefined){
			currentRoster.tanks[i] = temp;
			added = true;
			message.channel.send("Success : " + currentRoster.tanks[i] + "is now a tank for the roster.");
		}
	}
	if(added == false){
		message.channel.send("Error : no tank slot available.");
	}
}

function addHealerRoster(message) {
	var added = false;
	var i = 0;
	while(added == false && i < 2){
		if(currentRoster.healers[i] === undefined){
			currentRoster.healers[i] = temp;
			added = true;
			message.channel.send("Success : " + currentRoster.healers[i] + "is now a healer for the roster.");
		}
	}
	if(added == false){
		message.channel.send("Error : no healer slot available.");
	}
}
function addDpsRoster(message) {
	var added = false;
	var i = 0;
	while(added == false && i < 2){
		if(currentRoster.dps[i] === undefined){
			currentRoster.dps[i] = temp;
			added = true;
			message.channel.send("Success : " + currentRoster.dps[i] + "is now a dps for the roster.");
		}
	}
	if(added == false){
		message.channel.send("Error : no dps slot available.");
	}
}
/**
 * End Add Roster functions
 */
function showRoster(message) {
	var content = fs.readFileSync("rosterFile.json");
	currentRoster = JSON.parse(content);
	var output = "**Next raid info**\n";
	//Date part
	output += "Date : " + currentRoster.date + "\n";
	//Players part
	output += "Players : \n";
	output += "<:tank:372308202286481408> " + currentRoster.tanks[0] + "\n";
	output += "<:tank:372308202286481408> " + currentRoster.tanks[1] + "\n";
	output += "<:heal:372308202001530881> " + currentRoster.healers[0] + "\n";
	output += "<:heal:372308202001530881> " + currentRoster.healers[1] + "\n";
	output += "<:dps:372308165737447424> " + currentRoster.dps[0] + "\n";
	output += "<:dps:372308165737447424> " + currentRoster.dps[1] + "\n";
	output += "<:dps:372308165737447424> " + currentRoster.dps[2] + "\n";
	output += "<:dps:372308165737447424> " + currentRoster.dps[3] + "\n";
	//Content part
	output += "Content : " + currentRoster.content;
	message.channel.send(output);
}

class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roster',
            group: 'ffxiv',
            memberName: 'roster',
            description: 'Manages the roster',
            examples: ['roster'],
            args: [
                {
                    key: 'command',
                    prompt: 'Clear | Add (Arguments are `date`, `tank`, `healer`, `dps` and `content`) | Show',
                    type: 'string'
                }
            ]
        });
    }



	async run(message, args) {
		console.log(args);
		if (typeof args !== 'array' || typeof args !== 'undefined') {
			if(args.command == 'clear') {
				clearRoster(message);
			}
			if (args.command == 'show') {
				showRoster(message);
			}
			if (args.command == 'add date' ) {
				addDateRoster(message);
			}
			if (args.command == 'add tank' ) {
				addTankRoster(message);
			}
			if (args.command == 'add healer' ) {
				addHealerRoster(message);
			}
			if (args.command == 'add dps' ) {
				addDpsRoster(message);
			}
		}
  	}
}

module.exports = ReplyCommand;