const db = require("../../db.js")
const Discord = require("discord.js");
var SqlString = require('sqlstring');
const moment = require("moment");
const hastebin = require("hastebin-gen");

module.exports.run = async(client, message, args) => {
    message.delete().catch(O_o => {});

    let member = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);

    if (!member) return message.reply(":x: Je ne trouve pas la personne. Syntaxe: c!warns <@user|id>");

    let getWarns = `SELECT * FROM warns WHERE guild_id = '${message.guild.id}' AND user_id = '${member.id}';`;


    db.query(getWarns, async function(err, results, fields) {
        if (err) return message.channel.send(`Erreur: ${err.message}`);

        if (results[0] == undefined) {
            let embed = new Discord.MessageEmbed();
            embed.setDescription(":x: Cette personne ne possède pas d'avertissements")
            embed.setFooter(client.user.username, client.user.avatarURL());
            embed.setTimestamp();
            embed.setThumbnail(member.user.avatarURL({ dynamic: true }))
            embed.setColor("#36393f");

            message.channel.send(embed);


        } else {

            let embed = new Discord.MessageEmbed();
            let header = "**Liste des avertissements de <@" + member.id + ">**\n\n"
            let builder = ""

            results.forEach(warn => {
                let date = moment(warn.createdAt).format("D/MM/YY à HH:mm")
                builder = builder + `\`#${warn.id}\` |  ${date}: \`${warn.reason}\` par <@${warn.warner_id}>\n`
            });

            if (builder.length >= 2000) {
                hastebin(builder, { extension: "txt", url: "https://haste.chaun14.fr" }).then(haste => {
                    console.log(haste)
                    embed.setDescription(header + haste)
                    embed.setFooter(client.user.username, client.user.avatarURL());
                    embed.setTimestamp();
                    embed.setThumbnail(member.user.avatarURL({ dynamic: true }))
                    embed.setColor("#36393f");

                    message.channel.send(embed);
                }).catch(error => {

                    console.error(error)
                    throw error;
                });
            } else {
                embed.setDescription(header + builder)
                embed.setFooter(client.user.username, client.user.avatarURL());
                embed.setTimestamp();
                embed.setThumbnail(member.user.avatarURL({ dynamic: true }))
                embed.setColor("#36393f");

                message.channel.send(embed);
            }
        }
    })
}


module.exports.config = {
    category: "modération",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["wrns", "Warns"],
    serverForced: false
}

module.exports.help = {
    description: "Affichez les avertissement d'un membre",
    utilisations: `warns <@user|id>`,
    exemples: `c!warns @chaun14#1403`
}