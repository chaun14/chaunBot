const db = require("../../db.js")
const Discord = require("discord.js");
const music = require("../../modules/music.js")

module.exports.run = async(client, message, args) => {

    music.randomize(message, args)

}


module.exports.config = {
    category: "Musique",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["rdm"],
    serverForced: false
}

module.exports.help = {
    description: "Mélange la file d'attente",
    utilisations: `randomize`,
    exemples: `c!randomize`
}