const db = require("../../db.js")
const Discord = require("discord.js");


module.exports.run = async(client, message, args) => {
    if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(":x: Vous n'avez pas la permission d'utiliser cette commande ;(")
    message.delete().catch(O_o => {});

    let toBan = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);

    if (!toBan) return message.reply(":x: Je ne trouve pas la personne à bannir. Syntaxe: c!ban @user <raison>");

    if (toBan === message.author) return message.channel.send(":x: Ce n'est pas très gentil de vous ban vous même");

    if (!toBan.bannable)
        return message.reply(":x: Désolé mais un problème de type problématique m'a empêché de ban l'individu récalcitrant. Ai-je la permission de ban? Ai-je mon rôle au dessus du membre en question?");

    let reason = args.slice(1).join(' ');

    if (!reason) reason = "Pas de raison fournie";

    let embed = new Discord.MessageEmbed();
    embed.setAuthor("🔰 Banissement");
    embed.setDescription(`:warning: Désolé de te l'annoncer mais tu as été ban du serveur **${message.guild.name}**\n Raison: \`${reason}\``)
    embed.setFooter(client.user.username, client.user.avatarURL());
    embed.setTimestamp();
    embed.setColor("#36393f");

    await toBan.send(embed);

    toBan.ban(reason).catch(error => message.reply(`:x: Désolé ${message.author.tag}, je ne peut pas ban car: ${error}`));

    message.channel.send(`<@${toBan.user.id}> (${toBan.user.username}) à été banni :hammer:`);
}


module.exports.config = {
    category: "modération",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["bannir", "banner"],
    serverForced: false
}

module.exports.help = {
    description: "Dites au revoir à tous les nuisibles",
    utilisations: `ban @user <raison>`,
    exemples: `c!ban @chaun14#1403 est un mouton`
}