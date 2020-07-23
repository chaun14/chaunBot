const db = require("../../db.js")
const Discord = require("discord.js");
const music = require("../../modules/music.js")

module.exports.run = async(client, message, args) => {

    music.playcmd(client, message, args)

}


module.exports.config = {
    category: "Musique",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["p"],
    serverForced: false
}

module.exports.help = {
    description: "joue une musique",
    utilisations: `play <name/url/playlisturl>`,
    exemples: `c!play beep beep i'm a sheep`
}