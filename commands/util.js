module.exports = {
	capsFirstLetter : function(msg){
		msg = "" + msg;
		if(!msg)
			return null;
		var res = "";
		res += msg.substring(0,1).toUpperCase();
		var prevChar = msg.substring(0,1);
		for(var i = 1; i < msg.length; i++){
			if(prevChar == ' ')
				res += msg.substring(i,i+1).toUpperCase();
			else
				res += msg.substring(i,i+1);
			prevChar = msg.substring(i,i+1);
		}
		return res;
	},

	snowflakeToID : function(snowflake){
		snowflake = "" + snowflake;
		var i = 0;
		var j = 1;
		var end = snowflake.length - 1;
		var currentNum = snowflake.substring(i,j);
		while(currentNum == "<" || currentNum == "@" || currentNum == "!"){
			i = j;
			j = j + 1;
			currentNum = snowflake.substring(i,j);
		}
		return snowflake.substring(i,end);
	},

	isSnowflake : function(msg){
		msg = "" + msg;
		if(msg.substring(0,1) == "<" && msg.substring(1,2) == "@" && msg.substring(msg.length - 1, msg.length) == ">"){
			return true;
		}
		return false
	}
};