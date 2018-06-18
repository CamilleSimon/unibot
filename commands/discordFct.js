module.exports = {
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
	},

	errorMsg : function(msg, channel){
		if(channel){
			const embed = {
				"description": "**Erreur !**\n" + msg,
				"color": 0xff0000,
				"timestamp": new Date(),
				"thumbnail": {
					"url": "attachment://confuse.png"
				}
			}; 
			channel.say({ embed, files: [{ attachment: 'confuse.png', name: 'confuse.png' }] });
		}
	},

	successMsg : function(msg, channel){
		if(channel){
			const embed = {
				"description": "**Succès !**\n" + msg,
				"color": 0x00ff00,
				"timestamp": new Date(),
				"thumbnail": {
					"url": "attachment://happy.png"
				}
			};
			channel.say({ embed, files: [{ attachment: 'happy.png', name: 'happy.png' }] });
		}
	},

	interrogationMsg : function(msg, channel){
		if(channel){
			const embed = {
				"description": "**Euh ?!**\n" + msg,
				"color": 0x00ff00,
				"timestamp": new Date(),
				"thumbnail": {
					"url": "attachment://confuse.png"
				}
			};
			channel.say({ embed, files: [{ attachment: 'confuse.png', name: 'confuse.png' }] });
		}
	}
};