const { Command } = require('discord.js-commando');
const fs = require("fs");
const yt = require('ytdl-core');
const tokens = require('./tokens.json');

var queuee = {};

function join (msg) {
    var voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel || voiceChannel.type !== 'voice') 
        return msg.reply('I couldn\'t connect to your voice channel...');
    voiceChannel.join();
}

function stop (msg) {
    var voiceChannel = msg.member.voiceChannel;
    voiceChannel.leave();
}

function add (url, username, msg) {
	if (url == '' || url === undefined) 
        return msg.channel.sendMessage(`You must add a YouTube video url, or id after ${tokens.prefix}add`);
	yt.getInfo(url, (err, info) => {
    	if(err) 
            return msg.channel.sendMessage('Invalid YouTube Link: ' + err);
    	if (!queuee.hasOwnProperty(msg.guild.name)) {
            queuee[msg.guild.name] = {};
    	    queuee[msg.guild.name].playing = false;
    	    queuee[msg.guild.name].songs = [];
    	}
    	queuee[msg.guild.name].songs.push({url: url, title: info.title, requester: msg.author.username});
        console.log(queuee);
        console.log(queuee[0]);
    	msg.channel.sendMessage(`added **${info.title}** to the queue`);
	});
}

function queue (msg) {
    if (queuee[msg.guild.name] === undefined) 
        return msg.channel.sendMessage(`Add some songs to the queue first with ${tokens.prefix}add`);
    var tosend = [];
    queuee[msg.guild.name].songs.forEach((song, i) => { 
        tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);
    });
    msg.channel.sendMessage(`__**${msg.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
}

function help (msg) {
    var tosend = ['```xl', tokens.prefix + 'join : "Join Voice channel of msg sender"', tokens.prefix + 'add : "Add a valid youtube link to the queue"', tokens.prefix + 'queue : "Shows the current queue, up to 15 songs shown."', tokens.prefix + 'play : "Play the music queue if already joined to a voice channel"', '', 'the following commands only function while the play command is running:'.toUpperCase(), tokens.prefix + 'pause : "pauses the music"',   tokens.prefix + 'resume : "resumes the music"', tokens.prefix + 'skip : "skips the playing song"', tokens.prefix + 'time : "Shows the playtime of the song."',  'volume+(+++) : "increases volume by 2%/+"',    'volume-(---) : "decreases volume by 2%/-"',    '```'];
    msg.channel.sendMessage(tosend.join('\n'));
}

function play2 (msg) {
    if (queuee[msg.guild.name] === undefined) return msg.channel.sendMessage(`Add some songs to the queue first with ${tokens.prefix}add`);
        if (!msg.guild.voiceConnection) join(msg);
        if (queuee[msg.guild.name].playing) return msg.channel.sendMessage('Already Playing');
        queuee[msg.guild.name].playing = true;

        (function play(song) {
        	console.log(song + 'test');
        	var dispatcher;
            console.log(song);
            if (song === undefined) return msg.channel.sendMessage('Queue is empty').then(() => {
                queuee[msg.guild.name].playing = false;
                msg.member.voiceChannel.leave();
            });
            msg.channel.sendMessage(`Playing: **${song.title}** as requested by: **${song.requester}**`);
            dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes : tokens.passes });
            var collector = msg.channel.createCollector(m => m);
            collector.on('collect', m => {
                if (m.content.startsWith(tokens.prefix + 'pause')) {
                    msg.channel.sendMessage('paused').then(() => {dispatcher.pause();});
                } else if (m.content.startsWith(tokens.prefix + 'resume')){
                    msg.channel.sendMessage('resumed').then(() => {dispatcher.resume();});
                } else if (m.content.startsWith(tokens.prefix + 'skip')){
                    msg.channel.sendMessage('skipped').then(() => {dispatcher.end();});
                } else if (m.content.startsWith('volume+')){
                    if (Math.round(dispatcher.volume*50) >= 100) return msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
                    dispatcher.setVolume(Math.min((dispatcher.volume*50 + (2*(m.content.split('+').length-1)))/50,2));
                    msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
                } else if (m.content.startsWith('volume-')){
                    if (Math.round(dispatcher.volume*50) <= 0) return msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
                    dispatcher.setVolume(Math.max((dispatcher.volume*50 - (2*(m.content.split('-').length-1)))/50,0));
                    msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
                } else if (m.content.startsWith(tokens.prefix + 'time')){
                    msg.channel.sendMessage(`time: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
                }
            });
            dispatcher.on('end', () => {
                collector.stop();
                play(queuee[msg.guild.name].songs.shift());
                msg.member.voiceChannel.leave();
            });
            dispatcher.on('error', (err) => {
                return msg.channel.sendMessage('error: ' + err).then(() => {
                    collector.stop();
                    play(queuee[msg.guild.name].songs.shift());
                });
            });
        })(queuee[msg.guild.name].songs.shift());
}

module.exports = class ReplyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'music',
            group: 'general',
            memberName: 'music',
            description: 'Music :D',
            examples: ['scheduleadd Nyu Mori'],
            args: [
                {
                    key: 'commands',
                    prompt: 'Commands of the Music Bot',
                    type: 'string'
                },
                {
                    key: 'url',
                    prompt: 'Link for YouTube Video',
                    type: 'string',
                    default : ''
                }
            ]
        });
    }

    run(msg, { commands, url }) {
        console.log("Author username : " + msg.author.lastMessage.member.nickname + ", command : " + commands + ", url : " + url);
            if(commands == 'play'){
                play2(msg)
            }
            else if (commands == 'help'){
                help (msg)
            }
            else if (commands == 'queue' ){
                queue(msg)
            }
            else if (commands == 'add' ){
                add(url, msg.author.lastMessage.member.username, msg);
            }
            else if (commands == 'join' ){
                join(msg)
            }
             else if (commands == 'stop' ){
                leave(msg);
            }
            else if (commands == 'queue2' ){
                console.log(queuee[msg.guild.name]);
            }
    }
};