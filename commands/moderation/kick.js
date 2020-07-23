const db = require("../../db.js")
const Discord = require("discord.js");


module.exports.run = async(client, message, args) => {
    if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(":x: Vous n'avez pas la permission d'utiliser cette commande ;(")
    message.delete().catch(O_o => {});

    let toKick = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);

    if (!toKick) return message.reply(":x: Je ne trouve pas la personne à kick. Syntaxe: c!kick @user <raison>");

    if (toKick.user === message.author) return message.channel.send(":x: Ce n'est pas très gentil de vous kick vous même");

    if (!toKick.kickable)
        return message.reply(":x: Désolé mais un problème de type problématique m'a empêché de kick l'individu récalcitrant. Ai-je la permission de kick? Ai-je mon rôle au dessus du membre en question?");

    let reason = args.slice(1).join(' ');

    if (!reason) reason = "Pas de raison fournie";

    let embed = new Discord.MessageEmbed();
    embed.setAuthor("🔰 Kick");
    embed.setDescription(`:warning: Désolé de te l'annoncer mais tu as été kick du serveur **${message.guild.name}**\n Raison: \`${reason}\``)
    embed.setFooter(client.user.username, client.user.avatarURL());
    embed.setTimestamp();
    embed.setColor("#36393f");

    await toKick.send(embed);

    toKick.kick(reason).catch(error => message.reply(`:x: Désolé ${message.author.tag}, je ne peut pas kick car: ${error}`));

    message.channel.send(`<@${toKick.user.id}> (${toKick.user.username}) à été kick :hammer:`);
}


module.exports.config = {
    category: "modération",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["kicke"],
    serverForced: false
}

module.exports.help = {
    description: "Éjectez des personnes de votre serveur",
    utilisations: `kick @user <raison>`,
    exemples: `c!kick @chaun14#1403 est un mouton`
}