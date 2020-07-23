const db = require("../../db.js")
const Discord = require("discord.js");
const music = require("../../modules/music.js")

module.exports.run = async(client, message, args) => {

    music.volumecmd(message, args)

}


module.exports.config = {
    category: "Musique",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["v"],
    serverForced: false
}

module.exports.help = {
    description: "Modifie le volume du player de musique",
    utilisations: `volume`,
    exemples: `c!volume 50`
}