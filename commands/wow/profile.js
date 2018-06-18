const { Command } = require('discord.js-commando');
const wowFct = require('./wowFct');

//Analyze chat message part
module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'profile',
            group: 'wow',
            memberName: 'profile',
            description: 'Affiche les informartions basiques sur un personnage',
            examples: ['!profile server name'],
            args: [
                {
                    key: 'server',
                    prompt: ' quel est le serveur du personnage ?',
                    type: 'string'
                },{
                    key: 'name',
                    prompt: ' quel est le nom du personnage ?',
                    type: 'string'
                }
            ]
        });
    }

	run(msg, {server, name}){
        console.log("Command : wowprofile, author : " + msg.author.lastMessage.member.nickname + ", arguments : " + server + ", " + name);
        wowFct.profile(server, name, msg);
	}
}