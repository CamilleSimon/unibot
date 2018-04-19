module.exports = {
	//Formalize a schedule for a nice display in Discord
	formalizeDay : function(day){
		//The longest day is 'Wednesday'and it have 9 letters
		//I choose to add space to 'day' until it size 9 caracters
		for(var i = day.length; i < 10; i++)
			day += " ";
		return day;
	},

	//Convert the number in the schedules variable as a time understandable by a human.
	convertNumToText : function(num){
		var msg = "";
		var h = Math.trunc(num/2);
		if(h < 10)
			msg += "0" + h + ":";
		else
			msg += h + ":";
		if((num/2 - h) != 0)
			return msg + "30";
		else
			return msg + "00";
	},

	//Convert the number in the schedules variable as a time understandable by a human.
	convertTextToNum : function(text){
		if(!text)
			return undefined;
		var tabular = new Array();
		//i for initial
		var i = Number(text.substr(0,2))*2;
		var im = Number(text.substring(3,5));
		//e for end
		var e = Number(text.substring(6,8))*2;
		var em = Number(text.substring(9,11));
		if(im == 30)
			i++;
		tabular.push(i);
		if(em == 30)
			e++;
		if(e == 0)
			e = 48;
		tabular.push(e);
		return tabular
	},

	containUnavailable : function(list){
		for(var day in list){
			if(list[day] == "unavailable")
				return true;
		}
		return false;
	},

	switchDayMonth : function(date){
		return date.substring(3,5) + "/" + date.substring(0,2);
	},

	nextWeek : function(list, today){
		var listSort = new Array();
		var i;
		var found;
		var date;
		for(var j = 0; j < 7; j++){
			date = today + i;
			i = 0;
			found = false;
			while(i < list.length && found == false){
				//console.log("date : " + date + ", list.length : " + list.length + ", i : " + i + ", list[i].day : " + list[i].day);
				if(list[i].day == date){
					listSort.push(list[i]);
					found = true;
				}
				i++;
			}
			if(found == false){
				listSort.push({
    				"day" : date,
    				"players" : undefined
				})
			}
		}
		console.log(listSort);
		return listSort;
	},

	convertNumToDay : function(num){
		switch(num){
			case 0 : return "Sunday";
			case 1 : return "Monday";
			case 2 : return "Tuesday";
			case 3 : return "Wednesday";
			case 4 : return "Thursday";
			case 5 : return "Friday";
			case 6 : return "Saturday";
		}
	}
};