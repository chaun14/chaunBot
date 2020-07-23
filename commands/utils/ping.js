const db = require("../../db.js")
const Discord = require("discord.js");


module.exports.run = async(client, message, args) => {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Le ping du bot est de ${m.createdTimestamp - message.createdTimestamp}ms. Ping de l'API ${Math.round(client.ws.ping)}ms`);


}


module.exports.config = {
    category: "Utile",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["ping"],
    serverForced: false
}

module.exports.help = {
    description: "Commande pour afficher le ping du bot",
    utilisations: `ping`,
    exemples: `c!ping`
}