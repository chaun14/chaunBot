const db = require("../../db.js")
const Discord = require("discord.js");
const music = require("../../modules/music.js")

module.exports.run = async(client, message, args) => {

    music.skipcmd(client, message, args)

}


module.exports.config = {
    category: "Musique",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["sk"],
    serverForced: false
}

module.exports.help = {
    description: "Passe à la chanson suivante",
    utilisations: `skip`,
    exemples: `c!skip`
}