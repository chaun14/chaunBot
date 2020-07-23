const db = require("../../db.js")
const Discord = require("discord.js");
const music = require("../../modules/music.js")

module.exports.run = async(client, message, args) => {

    music.nowplayingcmd(message, args)

}


module.exports.config = {
    category: "Musique",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["np"],
    serverForced: false
}

module.exports.help = {
    description: "Affiche la musique en train d'être jouée",
    utilisations: `nowplaying`,
    exemples: `c!nowplaying`
}