const db = require("../../db.js")
const Discord = require("discord.js");
const moment = require("moment");
const hastebin = require("hastebin-gen");
var SqlString = require('sqlstring');

module.exports.run = async(client, message, args) => {

    let user = message.mentions.members.first();


    if (args[0] == undefined) {
        message.reply("Veuillez mentionner quelqu'un")
        return
    }
    console.log(user)
    if (user == undefined) {




        message.channel.send("Je cherche par id... ⏳").then(msg => {




            let searchOldPseudos = `SELECT
    *
    FROM
    userNameLogger
    WHERE
    userId = ${SqlString.escape(args[0])}
    ORDER BY updateDate ASC
    `

            let pseudos = "";

            db.query(searchOldPseudos, function(err, results, fields) {
                if (err) {
                    console.log(err.message);
                }
                //  console.log(results)
                if (results == undefined || results[0] == undefined) {
                    msg.edit("❌ Désolé cet id n'est pas dans ma base de données")
                    return
                }

                results.forEach(pseudo => {
                    let actionMessage = "détecté le";
                    console.log(pseudo.reason)
                    if (pseudo.reason == "ajout par userupdate") {
                        actionMessage = "changé le";
                    }

                    pseudos = pseudos + "`" + pseudo.newUsername + "` *" + actionMessage + " " + moment(pseudo.updateDate).format("D/MM/YY à HH:mm") + "*\n"
                });
                var hasteLink = "erreur";

                if (pseudos.length >= 1000) {

                    hastebin(pseudos, { extension: "txt", url: "https://haste.chaun14.fr" }).then(haste => {
                        //  console.log(haste)
                        hasteLink == haste
                        let pseudoEmbed = new Discord.MessageEmbed();
                        pseudoEmbed.setFooter(client.user.username, client.user.avatarURL());
                        pseudoEmbed.setTimestamp();
                        pseudoEmbed.setColor("#dd0000");
                        pseudoEmbed.setAuthor("UsernameLogger")
                        pseudoEmbed.setDescription("__**Anciens pseudo de**__ " + args[0] + ":\n\n" + haste + "")
                        msg.edit(pseudoEmbed)
                    }).catch(error => {
                        // Handle error
                        console.error(error)

                    });
                } else {
                    let pseudoEmbed = new Discord.MessageEmbed();
                    pseudoEmbed.setFooter(client.user.username, client.user.avatarURL());
                    pseudoEmbed.setTimestamp();
                    pseudoEmbed.setColor("#dd0000");
                    pseudoEmbed.setAuthor("UsernameLogger")

                    pseudoEmbed.setDescription("__**Anciens pseudo de**__ " + args[0] + ":\n\n" + pseudos + "")
                    msg.edit(pseudoEmbed)
                }

            });

        })














    } else {



        message.channel.send("Je cherche par mention... ⏳").then(msg => {




            let searchOldPseudos = `SELECT
*
FROM
userNameLogger
WHERE
userId = '${user.id}'
ORDER BY updateDate ASC
`

            let pseudos = "";

            db.query(searchOldPseudos, function(err, results, fields) {
                if (err) {
                    console.log(err.message);
                }
                //  console.log(results)
                if (results == undefined || results[0] == undefined) {
                    msg.edit("❌ Désolé cette personne n'est pas dans ma base de données")
                    return
                }

                results.forEach(pseudo => {

                    let actionMessage = "détecté le";
                    console.log(pseudo.reason)
                    if (pseudo.reason == "ajout par userupdate") {
                        actionMessage = "changé le";
                    }

                    pseudos = pseudos + "`" + pseudo.newUsername + "` *" + actionMessage + " " + moment(pseudo.updateDate).format("D/MM/YY à HH:mm") + "*\n"
                });
                var hasteLink = "erreur";

                if (pseudos.length >= 1000) {

                    hastebin(pseudos, { extension: "txt", url: "https://haste.chaun14.fr" }).then(haste => {
                        //  console.log(haste)
                        hasteLink == haste
                        let pseudoEmbed = new Discord.MessageEmbed();
                        pseudoEmbed.setFooter(client.user.username, client.user.avatarURL());
                        pseudoEmbed.setTimestamp();
                        pseudoEmbed.setColor("#dd0000");
                        pseudoEmbed.setAuthor("UsernameLogger")
                        pseudoEmbed.setDescription("__**Anciens pseudo de**__ <@" + user.id + ">(" + user.user.username + "):\n\n" + haste + "")
                        msg.edit(pseudoEmbed)
                    }).catch(error => {
                        // Handle error
                        console.error(error)

                    });
                } else {
                    let pseudoEmbed = new Discord.MessageEmbed();
                    pseudoEmbed.setFooter(client.user.username, client.user.avatarURL());
                    pseudoEmbed.setTimestamp();
                    pseudoEmbed.setColor("#dd0000");
                    pseudoEmbed.setAuthor("UsernameLogger")

                    pseudoEmbed.setDescription("__**Anciens pseudo de**__ <@" + user.id + ">(" + user.user.username + "):\n\n" + pseudos + "")
                    msg.edit(pseudoEmbed)
                }

            });

        })
    }
}


module.exports.config = {
    category: "Utile",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["lusername", "un", "username", "usernamelist"],
    serverForced: false
}

module.exports.help = {
    description: "Commande pour afficher les anciens pseudo d'un membre",
    utilisations: `listusername @user`,
    exemples: `c!listusername @chaun14#1403`
}