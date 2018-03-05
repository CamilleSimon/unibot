//Find a specific player in the schedule with his firstName and surname
//DEPRECATED
function findPlayer(firstName, surname){
	var name = firstName + " " + surname;
	var i = 0;
	var player;
	while(i < schedules.length){
		player = schedules[i];
		if(player.name == name)
			return player;
		else
			i++;
	}
	return undefined;
}

//Show the schedule of a specific player
//DEPRECATED
function showPlayerSchedule(firstName, surname){
	var msg = "";
	var player = findPlayer(name);
	var attr;
	var time;
	for(attr in player){
		if (attr == "name")
			msg += "**" + player[attr] + "**```";
		else{
			schedule = player[attr];
			for(day in schedule){
				time = player[attr][day]
				msg += day + " : " + convertNumToText(time[0]) + "-" + convertNumToText(time[1]) + "\n";
			}
		}
	}
	return msg += "```";
}

//Add a player to the schedule
//DEPRECATED
function addPlayerSchedule(firstName, surname){
	var player = findPlayer(firstName, surname);
	if(player)
		return "Error : There are already a player named " + name + " recorded on the schedule.";
	var name = firstName + " " + surname;
	var player = {
		"name" : name,
		"schedule" : {
			"monday" : new Array(),
			"tuesday" : new Array(),
			"wednesday" : new Array(),
			"thursday" : new Array(),
			"friday" : new Array(),
			"saturday" : new Array(),
			"sunday" : new Array()
		}
	};
	schedule.push(player);
	return "Success : " + name + " added to the schedule."; 
}

//Remove all time of a specific player fo the schedule
//DEPRECATED
function clearPlayerSchedule(firstName, surname) {
	var player = findPlayer(firstName, surname);
	if(!player)
		return "Error : No player named " + name + " recorded on the schedule.";
	for(var j in player)
		if(j != "name")
			for(var k in player[j])
				player[j][k] = undefined;
	return "Success : " + name + " schedule cleared.";
}