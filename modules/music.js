const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');


const Discord = require("discord.js");
const hastebin = require("hastebin-gen");
const { client, Util } = require('discord.js');
const config = require("../informations/config");
const youtube = new YouTube(config.ytapikey);
const queue = new Map();

/* ----------------------------------- commandes de musique -----------------------------------*/
async function randomize(message, args) {
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send('Désolé mais vous devez être dans un salon vocal pour pouvoir profiter convenablement de cette commande!');
    if (!serverQueue) return message.channel.send('There is nothing playing.');

    shuffle(serverQueue.songs)

    return message.channel.send("La file d'attente à bien été mélangée")

}
async function volumecmd(message, args) {
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send('Désolé mais vous devez être dans un salon vocal pour pouvoir profiter convenablement de cette commande!');
    if (!serverQueue) return message.channel.send('There is nothing playing.');
    if (!args[0]) return message.channel.send(`Le volume actuel est : **${serverQueue.volume}**`.replace("@", "＠"));
    serverQueue.volume = args[0];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
    return message.channel.send(`Volume défini en : **${args[0]}**`.replace("@", "＠"));
}

async function pausecmd(message, args) {
    const serverQueue = queue.get(message.guild.id);
    if (serverQueue && serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        return message.channel.send('⏸ Musique en pause!');
    }
    return message.channel.send('There is nothing playing.');
}

async function resumecmd(message, args) {
    const serverQueue = queue.get(message.guild.id);
    if (serverQueue && !serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        return message.channel.send("▶ Musique en lecture!");
    }
    return message.channel.send('There is nothing playing.');

}

async function skipcmd(client, message, args) {
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send('Désolé mais vous devez être dans un salon vocal pour pouvoir profiter convenablement de cette commande!');
    if (!serverQueue) return message.channel.send("Désolé il n'y à rien à skip.");
    serverQueue.connection.dispatcher.destroy();
    serverQueue.songs.shift();
    play(client, message.guild, serverQueue.songs[0])

}

async function queuecmd(client, message, args) {
    const serverQueue = queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('Je n\'ai rien à lire');
    let queuemsg = (`
__**File d'attente:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
        `);

        if (queuemsg.length >= 1000) {
            hastebin(queuemsg, { extension: "txt", url: "https://haste.chaun14.fr" }).then(haste => {
                let embed = new Discord.MessageEmbed();
                embed.setFooter(client.user.username, client.user.avatarURL());
                embed.setTimestamp();
                embed.setColor("#dd0000");
                embed.setAuthor("File d'attente")
                embed.setDescription(haste + `\n**En train de jouer:** ${serverQueue.songs[0].title}`)
                message.channel.send(embed)
        })
        } else {
            let embed = new Discord.MessageEmbed();
            embed.setFooter(client.user.username, client.user.avatarURL());
            embed.setTimestamp();
            embed.setColor("#dd0000");
            embed.setAuthor("File d'attente")
            embed.setDescription(queuemsg + `\n**En train de jouer:** ${serverQueue.songs[0].title}` )
            message.channel.send(embed)
        }

        
      
}

async function nowplayingcmd(message, args){
    const serverQueue = queue.get(message.guild.id);
	if (!serverQueue) return message.channel.send("Il n'y a rien en cours de lecture.");
		return message.channel.send(`🎶 En train de jouer: **${serverQueue.songs[0].title}**`.replace("@", "＠"));
}

async function stopcmd(message, args){
 
    const serverQueue = queue.get(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send('Désolé mais vous devez être dans un salon vocal pour pouvoir profiter convenablement de cette commande!');
    if (!serverQueue) return message.channel.send("Je n'ai rien à arrêter.");
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.destroy();
    serverQueue.voiceChannel.leave();
    return undefined;
}

async function playcmd(client, message, args) {
    message.delete().catch(O_o => {});
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
    let video;
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) return message.channel.send('Désolé mais vous devez être dans un salon vocal pour pouvoir profiter convenablement la musique');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) {
        return message.channel.send("J'ai beau y mettre toute ma bonne volonté disponible ne n'arrive pas à rejoudre ce salon vocal, essayez de vérifier mes permissions :/");
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

        let embed = new Discord.MessageEmbed();
        embed.setFooter(client.user.username, client.user.avatarURL());
        embed.setTimestamp();
        embed.setColor("#dd0000");
        embed.setAuthor("Musique")
        embed.setDescription(`✅ La Playlist: **${playlist.title}** à bien été ajoutée à la file d'attente!`.replace("@", "＠"))
        

        return message.channel.send(embed)
        
    } else {
        try {
            video = await youtube.getVideo(url);
           
        } catch (error) {
            
            try {
                videos = await youtube.searchVideos(searchString, 10);
                let index = 0;



                message.channel.send(` __**Choix de musique:**__  \n${videos.map(video2 => `**${++index} -** ${video2.title}`.replace("@", "＠")).join('\n')}\nChoisissez la musique avec un nombre entre 1 et 10.`.replace("@", "＠"));
                   
                    message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, { max: 1, time: 30000, errors: ['time'] }).then(async response => {
                   
                        const videoIndex = parseInt(response.first().content);
                        video = await youtube.getVideoByID(videos[videoIndex - 1].id);

                    
                        return handleVideo(client, video, message, voiceChannel);

                    }).catch(collected => {
                        return message.channel.send('Pas de morceau choisi, annulation de la sélection.');
                    });









              
            } catch (err) {
                console.error(err);
                return message.channel.send("🆘 Désolé j'ai fouillé jusqu'au plus profond de youtube sans résultats");
            }
            return
        }
   
        if(!video) {
            message.channel.send(":x: Erreur de chargement de la musique")
        return
       }

        handleVideo(client, video, message, voiceChannel);
    }





}



/* ----------------------------------- fonctions pour musique -----------------------------------*/

async function handleVideo(client, video, message, voiceChannel, playlist = false) {
    const serverQueue = queue.get(message.guild.id);
   // console.log(video);
   if(!video) {
        message.channel.send("Erreur de chargement de la musique")
    return
   }
  
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
            return message.channel.send(`I could not join the voice channel: ${error}`.replace("@", "＠"));
        }
    } else {
        serverQueue.songs.push(song);
      //  console.log(song)
       // console.log(serverQueue.songs);
        if (playlist) return undefined;
        else {
            let embed = new Discord.MessageEmbed();
            embed.setFooter(client.user.username, client.user.avatarURL());
            embed.setTimestamp();
            embed.setColor("#dd0000");
            embed.setAuthor("Musique")
            embed.setDescription(`✅ La vidéo **${song.title}** à bien été ajoutée à la file d'attente!`.replace("@", "＠"))
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

    const dispatcher = serverQueue.connection.play(ytdl(song.url))
        .on('finish', reason => {
         
            if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');

        
            serverQueue.songs.shift();
            play(client, guild, serverQueue.songs[0])
            
        })
        .on('error', error => console.error(error));

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
   
      let embed = new Discord.MessageEmbed();
      embed.setFooter(client.user.username, client.user.avatarURL());
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
    randomize,
    resumecmd,
    pausecmd,
    volumecmd
};


function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}