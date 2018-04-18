const { Command } = require('discord.js-commando');

function name(id){
    //if(id == )
}

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'hug',
            group: 'general',
            memberName: 'hug',
            description: 'Hug budy !',
            examples: ['reply']
        });
    }

    run(msg) {
        console.log(msg.author);
        var name = msg.author;
        return msg.say("I love you too " + name + " !");
    }
};