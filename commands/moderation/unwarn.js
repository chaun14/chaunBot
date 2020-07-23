const db = require("../../db.js")
const Discord = require("discord.js");
var SqlString = require('sqlstring');
const moment = require("moment");
const hastebin = require("hastebin-gen");

module.exports.run = async(client, message, args) => {
    message.delete().catch(O_o => {});

    let member = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);

    if (!member) return message.reply(":x: Je ne trouve pas la personne. Syntaxe: c!unwarn <`@user`|`id`> <`#warn_id`|`warn_id`|`all`>");

    let warn_id = args[1]
    warn_id = warn_id.replace("#", "")

    if (Number.isInteger(Number(warn_id))) {


        let getWarns = `SELECT * FROM warns WHERE guild_id = '${message.guild.id}' AND user_id = '${member.id}';`;
        db.query(getWarns, async function(err, results, fields) {
            if (err) return message.channel.send(`Erreur: ${err.message}`);

            let isWarn = results.find(results => results.id == warn_id);
            if (!isWarn) return message.channel.send(":x: Veuillez spécifier un warn valide. Pour avoir la liste des warns d'une personne: `c!warns @user#1234`")




            let deleteWarn = `DELETE FROM warns WHERE warns.id = ${SqlString.escape(isWarn.id)};`
            db.query(deleteWarn, async function(err, results, fields) {
                if (err) return message.channel.send(`Erreur: ${err.message}`);

                message.channel.send(`:white_check_mark: L'avertissement \`#${isWarn.id}\` de \`${member.user.tag}\` à bien été supprimé`)

            })
        })

    } else {
        if (warn_id == "all") {

            let getWarns = `SELECT * FROM warns WHERE guild_id = '${message.guild.id}' AND user_id = '${member.id}';`;
            db.query(getWarns, async function(err, results, fields) {
                if (err) return message.channel.send(`Erreur: ${err.message}`);


                let isWarn = results.find(results => results.user_id == member.id);
                if (!isWarn) return message.channel.send(":x: Cette personne ne possède pas d'avertissement")


                let deleteWarn = `DELETE FROM warns WHERE warns.user_id = ${SqlString.escape(member.id)};`
                db.query(deleteWarn, async function(err, results, fields) {
                    if (err) return message.channel.send(`Erreur: ${err.message}`);

                    message.channel.send(`:white_check_mark: Tous les avertissements de \`${member.user.tag}\` ont bien été supprimés`)

                })

            })
        } else {
            message.channel.send(":x: Veuillez spécifez un id de warn correct Syntaxe: c!unwarn <`@user`|`id`> <`#warn_id`|`warn_id`|`all`>")
        }

    }
}


module.exports.config = {
    category: "modération",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["delwrns", "delwarn", "delWarn"],
    serverForced: false
}

module.exports.help = {
    description: "Supprimez un avertissement d'un membre",
    utilisations: `unwarn <@user|id> <#warn_id|warn_id|all>`,
    exemples: `c!unwarn @chaun14#1403 all, c!unwarn @chaun14#1403 #54`
}