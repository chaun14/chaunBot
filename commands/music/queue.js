const db = require("../../db.js")
const Discord = require("discord.js");
const music = require("../../modules/music.js")

module.exports.run = async(client, message, args) => {

    music.queuecmd(client, message, args)

}


module.exports.config = {
    category: "Musique",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["q"],
    serverForced: false
}

module.exports.help = {
    description: "Affiche la file d'attente pour la musique",
    utilisations: `queue`,
    exemples: `c!queue`
}