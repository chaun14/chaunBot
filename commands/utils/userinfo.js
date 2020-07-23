const db = require("../../db.js")
const Discord = require("discord.js");
const moment = require("moment");

module.exports.run = async(client, message, args) => {
    var member = message.mentions.members.first();
    const thecolor = "#000000".replace(/0/g, function() { return (~~(Math.random() * 16)).toString(16); });

    if (!args[0]) {
        member = message.member;
    }
    if (!member && args[0]) {
        member = message.guild.members.cache.get(args[0]);
        if (!member) return message.channel.send(':x: Erreur de syntaxe, je ne trouve pas la personne sur ce serveur \nc!userinfo <`rien`|`@user`|`id`>');
    }


    let pseudo = member.user.username;
    let tag = member.user.discriminator;
    let date_join = moment(member.joinedAt).format("D/MM/YY à HH:mm")
    let lastmsg = member.lastMessage;
    let id = member.id;
    let nickname = member.nickname;
    let avatar = member.user.avatarURL({ dynamic: true });
    let date_created = moment(member.user.createdAt).format("D/MM/YY à HH:mm")
    let salon = (member.voiceChannelID) ? 'Connecté dans ' + message.guild.channels.get(member.voiceChannelID).name : 'Non connecté';


    if (!nickname) {
        nickname = 'Pas de surnom'
    }
    if (!lastmsg) {
        lastmsg = 'Inconnu'
    }
    let jeu = member.presence.game;
    if (!jeu) {
        jeu = 'Pas de jeu'
    }
    let status = member.presence.status;
    if (status === "dnd") {
        status = 'Ne pas déranger'
    }
    if (status === "idle") {
        status = 'Inactif - AFK '
    }
    if (status === "online") {
        status = 'En ligne'
    }
    if (status === "offline") {
        status = 'Déconnecté'
    }

    let embed = new Discord.MessageEmbed()
        .setAuthor('Informations sur ' + pseudo)
        .setThumbnail(avatar)
        .setColor(thecolor)
        .addField('Pseudo', pseudo, true)
        .addField('Tag', tag, true)
        .addField('Surnom', nickname, true)
        .addField('❔ Id', id, true)
        .addField('💨 Date d\'arrivée sur ' + message.guild.name, date_join)
        .addField('💫 Date de création du compte', date_created)
        .addField('📨 Dernier message', lastmsg + " ")
        .addField('📣 Connexion à un salon vocal', salon)
        .addField('🕹 Jeu', jeu)
        .addField('🔆 Statut', status)
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp();

    message.channel.send(embed);

}


module.exports.config = {
    category: "Utile",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["ui"],
    serverForced: false
}

module.exports.help = {
    description: "Informations sur une personne",
    utilisations: `userinfo <rien|@user|id>`,
    exemples: `c!userinfo @chaun14#140`
}