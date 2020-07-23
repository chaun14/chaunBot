const db = require("../../db.js")
const Discord = require("discord.js");
var SqlString = require('sqlstring');

module.exports.run = async(client, message, args) => {
    message.delete().catch(O_o => {});

    let toWarn = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);

    if (!toWarn) return message.reply(":x: Je ne trouve pas la personne à avertir. Syntaxe: c!warn <@user|id> <raison>");

    if (toWarn === message.author) return message.channel.send(":x: Ce n'est pas très gentil de vous warn vous même");

    let reason = args.slice(1).join(' ')

    if (!reason) reason = "Pas de raison fournie";;

    let embed = new Discord.MessageEmbed();
    embed.setAuthor("⚠ Vous avez été averti");
    embed.setDescription(`Vous avez été averti par <@${message.author.id}> sur le serveur **${message.guild.name}**\n Raison: \`${reason}\``)
    embed.setFooter(client.user.username, client.user.avatarURL());
    embed.setTimestamp();
    embed.setColor("#36393f");



    let insertWarn = `INSERT INTO warns(guild_id, user_id, warner_id, type, reason) VALUES('${message.guild.id}', '${toWarn.id}','${message.author.id}', 'manual' , ${SqlString.escape(reason)})`;

    db.query(insertWarn, function(err, results, fields) {
        if (err) return message.channel.send(`Erreur: ${err.message}`);

        toWarn.send(embed);
        message.channel.send(`${toWarn.user.username} a bien été averti`);

    })



}


module.exports.config = {
    category: "modération",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["wrn", "Warn"],
    serverForced: false
}

module.exports.help = {
    description: "Avertissez un membre",
    utilisations: `warn <@user|id> <raison>`,
    exemples: `c!warn @chaun14#1403 le meilleur des moutons`
}