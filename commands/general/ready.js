const { Command } = require('discord.js-commando');

function shout(msg){
    var players = "<@134458267949596672>, <@71312098952486912>, <@191301539812474880>, <@133446537450618880>, <@325323405467451402>, <@201753233901879306>, <@134990948500242432>";
    return players + "\n Are you ready for an horrible dead? \n We start in 1 hour and  minutes"
}

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ready',
            group: 'general',
            memberName: 'ready',
            description: 'Say to people to be ready',
            examples: ['Fuck']
        });
    }
    run(msg) {
      return msg.say(shout(msg));
    }
}
