const db = require("../../db.js")
const Discord = require("discord.js");
const music = require("../../modules/music.js")

module.exports.run = async(client, message, args) => {

    music.pausecmd(message, args)

}


module.exports.config = {
    category: "Musique",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["Pause"],
    serverForced: false
}

module.exports.help = {
    description: "Met en pause la musique",
    utilisations: `pause`,
    exemples: `c!pause`
}