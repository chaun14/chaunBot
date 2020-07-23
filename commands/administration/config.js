const db = require("../../db.js")
const Discord = require("discord.js");
const sql = require("../../modules/sql")

module.exports.run = async(client, message, args) => {

    let toconfig = args[0];

    if (toconfig == "autorole" || toconfig == "autoRole" || toconfig == "Autorole" || toconfig == "AutoRole" || toconfig == "autorôle" || toconfig == "Autorôle") {


        if (args[1] == undefined || message.mentions.roles.first() == undefined) {
            return message.reply("veuillez mentionner un rôle à affecter aux nouveaux arrivants ex: c!config autorole @role")
        }

        let role = message.mentions.roles.first()


        if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
            message.reply("Désolé mais je n'ai pas la permission **Gérer les rôles** ou **Administrateur** sur ce serveur 😔\nModifiez mon rôle afin que je puisse intéragir avec le rôle à donner.")
        }

        let jsonObj = {
            "activated": true,
            "role": role.id
        }
        json = JSON.stringify(jsonObj);



        let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${message.guild.id}';`;
        db.query(getGuildSetting, function(err, results, fields) {
            if (err) console.log("erreur pour getguildsettings config --> " + err.message);




            let setAutoRole = `UPDATE guildSettings SET autoRole = '${json}' WHERE guildId = '${message.guild.id}';`;
            db.query(setAutoRole, function(err, results, fields) {
                if (err) {
                    console.log("erreur pour setAutoRole config" + err.message);
                }


                let embed = new Discord.MessageEmbed();
                embed.setAuthor("✅ Succès");
                embed.setDescription("Le rôle <@&" + role.id + "> sera donné aux nouveaux arrivant du serveur\n\n*Pensez à mettre mon rôle au dessus du rôle à attribuer afin que je puisse le donner sans problèmes*")
                embed.setFooter(client.user.username, client.user.avatarURL());
                embed.setTimestamp();
                embed.setColor("#36393f");
                message.channel.send(embed)
                console.log(message.content)
            })




        })






    } else if (toconfig == "no_txt" || toconfig == "notxt" || toconfig == "Notxt" || toconfig == "NoTxt" || toconfig == "noTxt" || toconfig == "No_txt") {



        let activated = false

        if (args[1] == "on") {
            activated = true
        } else if (args[1] == "off") {
            activated = false
        } else {
            return message.reply("veuillez mentionner un status pour le module d'auto hastebin ex: c!config notxt on")
        }

        sql.getGuildSettings(message.guild.id, (err, guildSettings) => {
            if (err) throw err
            let no_txtSettings = JSON.parse(guildSettings[0].no_txt);

            if (no_txtSettings.activated == activated) {
                let embed = new Discord.MessageEmbed();
                embed.setAuthor("❌ Erreur");
                embed.setDescription("Le module d'auto hastebin est déjà en position `" + args[1] + "`")
                embed.setFooter(client.user.username, client.user.avatarURL());
                embed.setTimestamp();
                embed.setColor("#36393f");
                message.channel.send(embed)


                return
            } else {


                let jsonObj = {
                    "activated": activated
                }

                json = JSON.stringify(jsonObj);
                console.log(json)

                sql.setNoTxt(message.guild.id, json, (err, result) => {
                    if (err) throw err

                    let embed = new Discord.MessageEmbed();
                    embed.setAuthor("✅ Succès");
                    embed.setDescription("Le module auto hastebin à bien été mis en postition `" + args[1] + "`")
                    embed.setFooter(client.user.username, client.user.avatarURL());
                    embed.setTimestamp();
                    embed.setColor("#36393f");
                    message.channel.send(embed)

                })

            }

        })






    } else {
        console.log("veuillez spécifier une config correcte")
        message.reply("Veuillez spécifier un paramètre correct à configurer: `autorole`,`notxt`")
    }






}


module.exports.config = {
    category: "Configuration",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["c"],
    serverForced: false
}

module.exports.help = {
    description: "Commande pour afficher le ping du bot",
    utilisations: `c!config <value>`,
    exemples: `c!config autorole`
}