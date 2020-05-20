const request = require('request');
const hastebin = require("hastebin-gen");
const Discord = require("discord.js");

module.exports.run = async(client, message, prefix, guildSettings) => {


    const supportedExtensions = ["txt", "js", "json", "class", "cfg", "py", "html", "htm", "java", "css", "php", "yml", "yaml", "md", "properties", "xml", "bat"]


    // on récup les pièce jointe au message
    let attachments = message.attachments.array()[0]
        // si il n'y en a pas return
    if (!attachments) return

    // on vérifie si le module est actif si non on dis qu'il est off
    let no_txtSettings = JSON.parse(guildSettings[0].no_txt);
    if (guildSettings[0].no_txt == null) {
        no_txtSettings = {
            "activated": false
        }
    }


    if (!no_txtSettings.activated) return

    // on récupère l'extension du fichier
    const fileExtension = attachments.name.split('.').pop();

    // on vérifie que cette extension est autorisée
    if (!supportedExtensions.find(extension => extension == fileExtension)) return

    // pour le debug
    // console.log(attachments)


    // on vérifie le poids du fichier 
    if (attachments.size >= 400000) return console.log(attachments.name + " trop lourd")


    request(attachments.url, function(error, response, body) {
        if (error) console.error('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

        if (!body) return

        // on ajoute la petite pub de qualitay
        body = `Auto hastebin module by chaunbot (https://chaunbot.chaun14.fr/)\n\n\n${body}`

        // on envoie sur haste puis send l'embed
        hastebin(body, { extension: fileExtension, url: "https://haste.chaun14.fr" }).then(haste => {

            let embed = new Discord.MessageEmbed();
            embed.setAuthor("🔗 Envoi automatique vers hastebin");
            embed.setDescription(`[Message](${message.url}) de <@${message.author.id}>\nlien: ${haste}`)
            embed.setFooter(client.user.username, client.user.avatarURL());
            embed.setTimestamp();
            embed.setColor("#36393f");

            message.channel.send(embed)
        })
    });
}