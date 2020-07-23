const db = require("../../db.js")
const Discord = require("discord.js");

const {
    version
} = require("discord.js");
const moment = require("moment");
const m = require("moment-duration-format");
let os = require('os')
let cpuStat = require("cpu-stat")
const ms = require("ms")

module.exports.run = async(client, message, args) => {
        let sicon = message.guild.iconURL;

        let cpuLol;
        cpuStat.usagePercent(function(err, percent, seconds) {
                    if (err) {
                        return console.log(err);
                    }
                    const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
                    const embedStats = new Discord.MessageEmbed()
                        .setAuthor(message.guild.name, sicon)
                        .setTitle("**Bot infos**")
                        .addField("• Mémoire vive utilisée", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`, true)
                        .addField("• Uptime ", `${duration}`, true)
                        .addField("• Nombre d'utilisateurs", `${client.users.cache.size.toLocaleString()}`, true)
                        .addField("• Nombre de serveurs", `${client.guilds.cache.size.toLocaleString()}`, true)
                        .addField("• Nombre de salons ", `${client.channels.cache.size.toLocaleString()}`, true)
                        .addField("• Discord.js", `v${version}`, true)
                        .addField("• Node", `${process.version}`, true)
                        .addField("• CPU", `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
                        .addField("• Utilisation cpu", `\`${percent.toFixed(2)}%\``, true)
                        .addField("• Architecture", `\`${os.arch()}\``, true)
                        .addField("• Platforme", `\`\`${os.platform()}\`\``, true)
                        .addField('Links :',`Ajoutez moi sur votre serveur ! [[Cliquez ici]](https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=1609956830&scope=bot)\nVisitez mon serveur de support ! [[Oh que oui]](https://discord.gg/gqFCbCN)`)
        message.channel.send(embedStats)
    })
}


module.exports.config = {
    category: "Utile",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["botinfo"],
    serverForced: false
}

module.exports.help = {
    description: "Commande pour afficher diverses infos sur le bot",
    utilisations: `botinfos`,
    exemples: `c!botinfos`
}