/**
 * Unibot discord server
 * Version 10-24 11:35
 * Author Simon Camille, Ballot Corentin
 */


//Loading all the librairies
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const Request = require("request");
const ytdl = require('ytdl-core');
const moment = require('moment-timezone');
const worker = require('webworker-threads').Worker
const twss = require('twss');

//Variable
var currentRoster;
var currentSchedule;

/**
 * Utilities functions
 */
 function output(error, token) {
        if (error) {
                console.log("There was an error logging in: ${error}");
                return;
        } else
                console.log("Logged in. Token: ${token}");
}

function clearRoster(){
	currentRoster.datetime = currentRoster.tanks[0] = 
	currentRoster.tanks[1] = currentRoster.healers[0] = 
	currentRoster.healers[1] = currentRoster.dps[0] = 
	currentRoster.dps[1] = currentRoster.dps[2] = 
	currentRoster.dps[3] = currentRoster.content = "";
}

function loadingData(){
	//Put the content of the file in the var 'content'
	var content = fs.readFileSync("rosterFile.json");
	//Parse the content as an Javascript object
	currentRoster = JSON.parse(content);
	
	content = fs.readFileSync("scheduleFile.json");
	
}

function display(message){
	if(currentSchedule === undefined){
		message.channel.send("No schedule available yet.");
	}
	else{
		message.channel.send("Maybe they are a chedule, maybe not, anyway.");
	}
}

/**
 * Discrod connection
 */
client.login('MzcxOTc3NTIwNTIzOTAyOTg3.DNCBPg.ZGC3_XzdgPcdrk9lVxFVXL7ujuo', output);

client.on('ready', () => {
	console.log("Successfully online");
	console.log('Logged in as ' + client.user.tag);
});

/**
 * Analyze users message on Discord chat
 */
client.on('message', (message) => {
	/**
	 * !hello : show a short text on the chan
	 */
	if(message.content.startsWith("!hello")){
		message.channel.send("Hello ! I'm Auty, the autistic Unibot ! I'm the Dark Autistic Fidget Spinner Static mascot !");
	}
	
	/**
	 * !roster : manage the rooster
	 */
	if(message.content.startsWith("!roster")){

		//Each cell of args content a word from 'message'
		args = message.content.split(' ');
		//If 'message' have more than 1 word
		if(args.length != 1){
			
			switch(args[1]){
				/**
				 * !roster clear : clear the current roster
				 */
				case 'clear' :
					clearRoster();
					message.channel.send("Success : Roster is cleared.");
					break;
				/**
				 * !roster show : show the current roster
				 * Date : Day Mon DD YYYY HH:mm:ss GMT+0000(UTC)
				 * Players : 
				 * Tank 1
				 * Tank 2
				 * Healer 1
				 * Healer 2
				 * DPS 1	
				 * DPS 2
				 * DPS 3
				 * DPS 4
				 * Content : Instance Name
				 */
				case 'show' :
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
					break;
				/**
				 * !roster add
				 */
				case 'add' :
					if(args.length < 2){
						message.channel.send("Error : Missed argument. Correct arguments are `date`, `tank`, `healer`, `dps` and `content`.");
					}
					else{
						var temp = "";
						for(i = 3; i < args.length; i++){
							temp += args[i] + " ";
						}
						switch(args[2]){
							case 'date' :
								currentRoster.date = new Date(temp);
								message.channel.send("Success : date for the next raid is now " + currentRoster.date + ".");
								break;
							case 'tank' :
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
								break;
							case 'healer' :
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
								break;
							case 'dps' : 
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
								break;
						}
					}
					//TODO save modification on the rosterFile
					break;
			}
		}
		//There are only one word on 'message' i.e. 'message = "!roster"'
		//This is an invalid command, show a message with correct
		else{
			message.channel.send("Error : Missed argument. Correct arguments are `clear`, `show` and `add`.");
		}
	}
	
	/**
	 * !schedule : manage the schedule
	 */
	if(message.content.startsWith("!schedule")){

		args = message.content.split(' ');

		if(args.length < 1){
			
			
		}
		//There are only one word on 'message' i.e. 'message = "!roster"'
		//This is an invalid command, show a message with correct
		else{
			message.channel.send(display(message));
			message.channel.send("Error : Missed argument. Correct arguments are `clear`, `show` and `add`.");
		}
	}
	
});