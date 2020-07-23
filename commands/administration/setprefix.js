const db = require("../../db.js")
const Discord = require("discord.js");
var SqlString = require('sqlstring');

module.exports.run = async(client, message, args) => {

    if (args[0] == undefined) {
        return message.reply("veuillez préciser un préfixe \nExemple: `c!setprefix /`")
    }

    let setPrefix = `UPDATE guildSettings SET prefix = ${SqlString.escape(args[0])} WHERE guildSettings.guildId = '${message.guild.id}';`;
    db.query(setPrefix, function(err, results, fields) {
        if (err) {
            console.log(err.message);
        }

        console.log("Ajout du préfix: " + args[0] + " sur: " + message.guild.name)

        message.channel.send("Le nouveau préfix `" + args[0] + "` à été défini avec succès")

    });



}


module.exports.config = {
    category: "Configuration",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["sp"],
    serverForced: false
}

module.exports.help = {
    description: "Commande pour changer le préfix",
    utilisations: `setprefix <préfix>`,
    exemples: `setprefix /`
}