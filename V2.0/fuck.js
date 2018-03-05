const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'fuck',
            group: 'general',
            memberName: 'fuck',
            description: 'Replies with a Lovely Message.',
            examples: ['Fuck']
        });
    }

    run(msg) {
        console.log(msg.author);
        return msg.say("Fuck you " + msg.author + " !");
    }
};