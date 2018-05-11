var request = require("request");
var result;
/*"image": {"url":"https://render-eu.worldofwarcraft.com/character/" + utile.radical(character.thumbnail) + "main.jpg"},*/
module.exports = {
    radical : function(thumbnail){
        thumbnail = "" + thumbnail;
        var current = thumbnail.substring(0,1);
        var i = 1;
        while(current != '-'){
            current = thumbnail.substring(i,i+1);
            i++;
        }
        return thumbnail.substring(0,i);
    }
}