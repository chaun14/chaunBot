const db = require("../../db.js")
const Discord = require("discord.js");
const music = require("../../modules/music.js")

module.exports.run = async(client, message, args) => {

    music.resumecmd(message, args)

}


module.exports.config = {
    category: "Musique",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["r"],
    serverForced: true
}

module.exports.help = {
    description: "Relance la musique",
    utilisations: `resume`,
    exemples: `c!resume`
}