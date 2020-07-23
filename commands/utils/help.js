const Discord = require("discord.js");
const db = require("../../db.js")

module.exports.run = async(client, message, args, prefixes) => {


    console.log("customprefix =" + args)
    const thecolor = "#000000".replace(/0/g, function() { return (~~(Math.random() * 16)).toString(16); });
    let catégories = [];

    let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${message.guild.id}';`;

    db.query(getGuildSetting, function(err, results, fields) {
        if (err) console.log(err.message);



        let embed = new Discord.MessageEmbed();
        embed.setDescription("Commande help \n Mon préfixe sur ce serveur est `" + "c!" + "` ou `" + results[0].prefix + "`");
        embed.setFooter(client.user.username, client.user.avatarURL());
        embed.setTimestamp();
        embed.setColor(thecolor);

        client.commands.forEach(command => {
            if (catégories.indexOf(command.config.category) == -1) {
                catégories.push(command.config.category)
            }
        });


        catégories.forEach(catégorie => {
            let commandlist = "";
            client.commands.forEach(command => {
                if (command.config.category == catégorie) {
                    commandlist = commandlist + "`" + command.config.name + "` *" + command.help.description + "*\n"
                }
            })
            embed.addField(catégorie, commandlist);
        });

        message.channel.send(embed);
    })


}



module.exports.config = {
    category: "Utile",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["h"],
    serverForced: false
}

module.exports.help = {
    description: "Commande d'aide.",
    utilisations: `help`,
    exemples: ``
}