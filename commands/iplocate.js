const Discord = require('discord.js')
const request = require('request');


module.exports.run = async(client, message, args) => {

    // console.log(color.blue, '[INFO]', color.white, `  Informations sur l'ip ${args[0]} demandées par ${message.member}`)
    if (!args[0]) return message.channel.send(":x: Veuillez spécifier une adresse ip ou un nom de domaine valide")
    request(`http://ip-api.com/json/${args[0]}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query`, function(error, response, body) {
        body = JSON.parse(body)

        if (body.status == "fail") {

            let embed = new Discord.MessageEmbed()
                .setTitle(`Error :x:`)
                .setColor("RED")
                .addField(`Sorry but i can't get infos for: ${body.query}`, `Error message: ${body.message}`)
            message.channel.send(embed);

        } else if (body.status = "success") {
            let embed = new Discord.MessageEmbed()
                .setTitle(`Informations for ${args[0]} (${body.query})`)
                .setColor("#36393f")
                .addField(":bust_in_silhouette: Owner", `**Organisation:** ${body.org} \n**Internet Service Provider:** ${body.isp} (${body.as})`)
                .addField(":earth_africa: Location", `**Country:** ${body.country} \n**City:** ${body.city}`)
                .addField(":zap: Other", `**mobile:** ${body.mobile} \n**Proxy:** ${body.proxy}\n**Hosting:** ${body.hosting}`)
            message.channel.send(embed);
        }


    });


}



module.exports.config = {
    category: "Utile",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["ipinfo", "ip", "iplocalise"],
    serverForced: false
}

module.exports.help = {
    description: "Affiche des informations sur une adresse ip ou un domaine",
    utilisations: `iplocate <ip|domain>`,
    exemples: `c!iplocate 1.1.1.1`
}