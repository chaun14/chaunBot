const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg');
const ffmpeg2 = require('ffmpeg-binaries');

const Discord = require("discord.js");
const hastebin = require("hastebin-gen");
const { client, Util } = require('discord.js');
const config = require("./informations/config");
const youtube = new YouTube(config.ytapikey);
const queue = new Map();

/* ----------------------------------- commandes de musique -----------------------------------*/

async function volumecmd(message, args){
    const serverQueue = queue.get(message.guild.id);
	if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		if (!args[0]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
		serverQueue.volume = args[0];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
		return message.channel.send(`I set the volume to: **${args[0]}**`);
}

async function pausecmd(message, args){
    const serverQueue = queue.get(message.guild.id);
	if (serverQueue && serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        return message.channel.send('⏸ Paused the music for you!');
    }
    return message.channel.send('There is nothing playing.');
}

async function resumecmd(message, args){
    const serverQueue = queue.get(message.guild.id);
	if (serverQueue && !serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        return message.channel.send('▶ Resumed the music for you!');
    }
    return message.channel.send('There is nothing playing.');

}

async function skipcmd(message, args){
    const serverQueue = queue.get(message.guild.id);
	if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing that I could skip for you.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
}

async function queuecmd(client, message, args){
    const serverQueue = queue.get(message.guild.id);
	if (!serverQueue) return message.channel.send('Je n\'ai rien à lire');
		let queuemsg = (`
__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
        `);

        if (queuemsg.length >= 1000) {
            hastebin(queuemsg, { extension: "txt", url: "https://haste.chaun14.fr" }).then(haste => {
                let embed = new Discord.RichEmbed();
                embed.setFooter(client.user.username, client.user.displayAvatarURL);
                embed.setTimestamp();
                embed.setColor("#dd0000");
                embed.setAuthor("File d'attente")
                embed.setDescription(haste)
                message.channel.send(embed)
        })
        } else {
            let embed = new Discord.RichEmbed();
            embed.setFooter(client.user.username, client.user.displayAvatarURL);
            embed.setTimestamp();
            embed.setColor("#dd0000");
            embed.setAuthor("File d'attente")
            embed.setDescription(queuemsg)
            message.channel.send(embed)
        }

        
      
}

async function nowplayingcmd(message, args){
    const serverQueue = queue.get(message.guild.id);
	if (!serverQueue) return message.channel.send('There is nothing playing.');
		return message.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
}

async function stopcmd(message, args){
 
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
    if (!serverQueue) return message.channel.send('There is nothing playing that I could stop for you.');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end('Stop command has been used!');
    return undefined;
}

async function playcmd(client, message, args) {
    var searchString = args.join('');
    //  console.log(args)
    /*
    args.forEach(arg => {
        searchString = searchString + " " + arg
    });
    */
    //   console.log(searchString + " cc "+args[0]  )
    const url = args[0] //? args[0].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(message.guild.id);

    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) {
        return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
    }
    if (!permissions.has('SPEAK')) {
        return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
    }

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        const playlist = await youtube.getPlaylist(url);
       // console.log(playlist)
        const videos = await playlist.getVideos();
        for (const video of Object.values(videos)) {
            const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
            handleVideo(client, video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
        }

        let embed = new Discord.RichEmbed();
        embed.setFooter(client.user.username, client.user.displayAvatarURL);
        embed.setTimestamp();
        embed.setColor("#dd0000");
        embed.setAuthor("Musique")
        embed.setDescription(`✅ La Playlist: **${playlist.title}** à bien été ajoutée à la file d'attente!`)
        

        return message.channel.send(embed)
    } else {
        try {
            var video = await youtube.getVideo(url);
        } catch (error) {
            try {
                var videos = await youtube.searchVideos(searchString, 10);
                let index = 0;



                message.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the search results ranging from 1-10.
					`);
                // eslint-disable-next-line max-depth
                try {
                    var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                        maxMatches: 1,
                        time: 10000,
                        errors: ['time']
                    });
                } catch (err) {
                    console.error(err);
                    return message.channel.send('No or invalid value entered, cancelling video selection.');
                }
                const videoIndex = parseInt(response.first().content);
                var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
            } catch (err) {
                console.error(err);
                return message.channel.send('🆘 I could not obtain any search results.');
            }
        }
        return handleVideo(client, video, message, voiceChannel);
    }





}



/* ----------------------------------- fonctions pour musique -----------------------------------*/

async function handleVideo(client, video, message, voiceChannel, playlist = false) {
    const serverQueue = queue.get(message.guild.id);
   // console.log(video);
    const song = {
        id: video.id,
        title: video.title,//Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
    };
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        queue.set(message.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(client, message.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            queue.delete(message.guild.id);
            return message.channel.send(`I could not join the voice channel: ${error}`);
        }
    } else {
        serverQueue.songs.push(song);
      //  console.log(song)
       // console.log(serverQueue.songs);
        if (playlist) return undefined;
        else {
            let embed = new Discord.RichEmbed();
            embed.setFooter(client.user.username, client.user.displayAvatarURL);
            embed.setTimestamp();
            embed.setColor("#dd0000");
            embed.setAuthor("Musique")
            embed.setDescription(`✅ La vidéo **${song.title}** à bien été ajoutée à la file d'attente!`)
            message.channel.send(embed);
            
            return
        } 
    }
    return undefined;
}

function play(client, guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    //console.log(serverQueue.songs);

    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', reason => {
            if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
            else console.log(reason);
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
      //  console.log(song)
      let embed = new Discord.RichEmbed();
      embed.setFooter(client.user.username, client.user.displayAvatarURL);
      embed.setTimestamp();
      embed.setColor("#dd0000");

      embed.setDescription(`🎶 Start playing: **${song.title}**`)
 
    serverQueue.textChannel.send(embed);
}


module.exports = {
    playcmd,
    stopcmd,
    nowplayingcmd,
    queuecmd,
    skipcmd,
    resumecmd,
    pausecmd,
    volumecmd
};




