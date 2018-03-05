const { Command } = require('discord.js-commando');

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'hello',
            group: 'general',
            memberName: 'hello',
            description: 'Says Hi!',
            examples: ['reply']
        });
    }

    run(msg) {
        return msg.say("Hello ! I'm Auty, the autistic Unibot ! I'm the Dark Autistic Fidget Spinner Static mascot !");
    }
};