const db = require("../../db.js")
const Discord = require("discord.js");
const moment = require("moment");
const hastebin = require("hastebin-gen");
const SqlString = require('sqlstring');
const node = require('nodeactyl');
const { Webhook } = require('discord-webhook-node');

module.exports.run = async(client, message, args) => {
    let action = args[0];
    let target = args[1];

    if (action == undefined) return message.channel.send("Veuillez spécifier une acion pour gérer le monitor `add/list/remove/enable/disable/restart`")


    if (action == "add") {
        console.log("Commande add ")

        message.channel.send("Allez vérifier vos message privé")

        message.author.send("Donnez moi l'id de votre bot :").then(async idquestion => {
            var idresponse = await idquestion.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000, errors: ['time'] });
            let bot_id = await idresponse.array()[0]
            bot_id = await bot_id.content

            let monitoredBot = client.users.cache.get(bot_id)
            if (!monitoredBot) return message.author.send("Je ne trouve pas ce bot, vérifiez que j'ai bien un serveur en commun avec ce dernier")

            console.log(bot_id)
            message.author.send("Donnez moi l'url du panel pterodactyl ou est hébergé votre bot :").then(async urlquestion => {
                var urlresponse = await urlquestion.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000, errors: ['time'] });
                let panelUrl = await urlresponse.array()[0]
                panelUrl = await panelUrl.content

                if (!ValidURL(panelUrl)) return message.author.send("L'url ne semble pas être valide")

                message.author.send("Donnez moi une clé api de ce panel : (https://i.imgur.com/k9oPdsf.png)").then(async keyquestion => {
                    var keyresponse = await keyquestion.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000, errors: ['time'] });
                    let panelKey = await keyresponse.array()[0]
                    panelKey = await panelKey.content

                    let pteroClient = node.Client;
                    pteroClient.login(panelUrl, panelKey, (logged_in, msg) => {

                        if (!logged_in) return message.author.send(":x: Impossible de se connecter. Vérifiez l'url et votre clé api")

                        message.author.send("Donnez moi l'id du serveur où est hébergé le bot sur le panel : (trouvable ici https://i.imgur.com/Y3Dk54N.png)").then(async idquestion => {
                            var idresponse = await idquestion.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000, errors: ['time'] });
                            let panelid = await idresponse.array()[0]
                            panelid = await panelid.content

                            let getUserMonitors = `SELECT * FROM monitors WHERE owner_id = '${message.author.id}' AND server_id = ${SqlString.escape(panelid)};`
                            db.query(getUserMonitors, function(err, monitors, fields) {
                                if (monitors[0] !== undefined) return message.author.send(":x: Vous surveillez déjà ce serveur")

                                pteroClient.getServerInfo(panelid).then(panelResponse => {

                                    message.author.send("Parfait le serveur `" + panelResponse.attributes.name + "` est bien accessible\n Il reste juste à me donner un lien complet de webhook vers un salon discord de log").then(async webhookquestion => {
                                        var webhookresponse = await webhookquestion.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000, errors: ['time'] });
                                        let webhook = await webhookresponse.array()[0]
                                        webhook = await webhook.content


                                        const hook = new Webhook(webhook)
                                        hook.send("Test de votre webhook").then(() => {



                                                let newMonitor = ` INSERT INTO monitors(owner_id, bot_id, bot_name, server_id, panel_url, api_key, active, webhook) VALUES('${message.author.id}', '${monitoredBot.id}', ${SqlString.escape(monitoredBot.tag)}, ${SqlString.escape(panelid)}, ${SqlString.escape(panelUrl)}, ${SqlString.escape(panelKey)}, 1, ${SqlString.escape(webhook)})`;
                                                db.query(newMonitor, function(err, results, fields) {
                                                    if (err) return console.log(err.message);


                                                    console.log("Ajout du préfix par défaut de " + message.guild.name)

                                                });


                                                message.author.send("La configuration est désormais terminée")




                                            })
                                            .catch(err => {
                                                return message.author.send(":x: Votre webhook ne fonctionne pas")
                                            });

                                    })

                                }).catch((error) => {

                                    return message.author.send(":x: Quelque chose s'est mal passé lors de la recherche du serveur sur le panel : `" + error.response.statusText + "` \nVérifiez que vous avez bien donné le bon identifiant de serveur du bot sur le panel")
                                });

                            })
                        })
                    })
                })
            })
        })


    } else if (action == "remove") {
        console.log("Commande remove " + target)
        let getUserMonitors = `SELECT * FROM monitors WHERE owner_id = '${message.author.id}';`
        db.query(getUserMonitors, function(err, monitors, fields) {
            if (err) throw err
            if (monitors[0] == undefined) {
                return message.channel.send("Désolé tu n'as pas de monitor lié à ton compte. Pour en ajouter un `c!monitor add`")
            }
            if (target == undefined) {
                return message.channel.send("Tu dois spécifier un id de bot discord surveillé")
            }
            let botMonitor = monitors.find(monitors => monitors.bot_id === target)

            if (botMonitor == undefined) {
                return message.channel.send("Désolé je ne trouve pas ce bot dans la liste de vos bots surveillés")
            }

            let removeMonitor = `DELETE FROM monitors WHERE monitors.id = ${SqlString.escape(botMonitor.id)};`;
            db.query(removeMonitor, function(err, monitors, fields) {
                if (err) {

                    message.channel.send(":x: Erreur lors de la suppression de ce monitor")
                    throw err
                }
                message.channel.send("Le monitor à bien été supprimé")

            })

        })
    } else if (action == "list") {

        let getUserMonitors = `SELECT * FROM monitors WHERE owner_id = '${message.author.id}';`

        db.query(getUserMonitors, function(err, monitors, fields) {

            if (monitors[0] == undefined) {
                return message.channel.send("Désolé tu n'as pas de monitor lié à ton compte. Pour en ajouter un `c!monitor add`")
            }


            let Monitors;

            let embed = new Discord.MessageEmbed();
            embed.setFooter(client.user.username, client.user.avatarURL());
            embed.setTimestamp();
            embed.setColor("#34eb71");
            embed.setAuthor("Système de monitoring")


            monitors.forEach(monitor => {
                let active;
                if (monitor.active == 1) active = "✅"
                else active = ':x:'
                if (Monitors == undefined) {
                    Monitors = active + " <@" + monitor.bot_id + "> (" + monitor.bot_id + ") --> " + monitor.panel_url + " (`" + monitor.server_id + "`)"
                } else {
                    Monitors = Monitors + " \n" + active + " <@" + monitor.bot_id + "> (" + monitor.bot_id + ") --> " + monitor.panel_url + " (`" + monitor.server_id + "`)"
                }
            });
            embed.setDescription("__**Vos monitors:**__\n" + Monitors)
            embed.addField("Informations", "Si :x: alors le monitor est désactivé. Pour désactiver `c!monitor disable iddubot` \n\n Pour en ajouter un nouveau `c!monitor add`")
            message.author.send(embed)
            message.channel.send("Vérifiez vos messages privés")

        })


    } else if (action == "enable") {
        console.log("Commande enable " + target)
        let getUserMonitors = `SELECT * FROM monitors WHERE owner_id = '${message.author.id}';`
        db.query(getUserMonitors, function(err, monitors, fields) {
            if (err) throw err
            if (monitors[0] == undefined) {
                return message.channel.send("Désolé tu n'as pas de monitor lié à ton compte. Pour en ajouter un `c!monitor add`")
            }
            if (target == undefined) {
                return message.channel.send("Tu dois spécifier un id de bot discord surveillé")
            }
            let botMonitor = monitors.find(monitors => monitors.bot_id === target)

            if (botMonitor == undefined) {
                return message.channel.send("Désolé je ne trouve pas ce bot dans la liste de vos bots surveillés")
            }

            if (botMonitor.active == 1) {
                return message.channel.send("Ce monitor est déjà actif")
            }
            let setActive = `UPDATE monitors SET active = 1 WHERE monitors.id = '${botMonitor.id}';`;
            db.query(setActive, function(err, monitors, fields) {
                if (err) throw err
                message.channel.send("Le monitor à bien été activé")

            })

        })

    } else if (action == "disable") {
        console.log("Commande disable " + target)
        let getUserMonitors = `SELECT * FROM monitors WHERE owner_id = '${message.author.id}';`
        db.query(getUserMonitors, function(err, monitors, fields) {
            if (err) throw err
            if (monitors[0] == undefined) {
                return message.channel.send("Désolé tu n'as pas de monitor lié à ton compte. Pour en ajouter un `c!monitor add`")
            }
            if (target == undefined) {
                return message.channel.send("Tu dois spécifier un id de bot discord surveillé")
            }
            let botMonitor = monitors.find(monitors => monitors.bot_id === target)

            if (botMonitor == undefined) {
                return message.channel.send("Désolé je ne trouve pas ce bot dans la liste de vos bots surveillés")
            }

            if (botMonitor.active == 0) {
                return message.channel.send("Ce monitor est déjà désactivé")
            }
            let setActive = `UPDATE monitors SET active = 0 WHERE monitors.id = '${botMonitor.id}';`;
            db.query(setActive, function(err, monitors, fields) {
                if (err) throw err
                message.channel.send("Le monitor à bien été désactivé")
            })

        })

    } else if (action == "restart") {

        console.log("Commande restart " + target)
        let getUserMonitors = `SELECT * FROM monitors WHERE owner_id = '${message.author.id}';`
        db.query(getUserMonitors, function(err, monitors, fields) {
            if (err) throw err
            if (monitors[0] == undefined) {
                return message.channel.send("Désolé tu n'as pas de monitor lié à ton compte. Pour en ajouter un `c!monitor add`")
            }
            if (target == undefined) {
                return message.channel.send("Tu dois spécifier un id de bot discord surveillé")
            }
            let botMonitor = monitors.find(monitors => monitors.bot_id === target)

            if (botMonitor == undefined) {
                return message.channel.send("Désolé je ne trouve pas ce bot dans la liste de vos bots surveillés")
            }


            const Client = node.Client;

            Client.login(botMonitor.panel_url, botMonitor.api_key, (logged_in, err) => {


                console.log("login")


                if (!logged_in) {
                    return message.channel.send(":x: Impossible de me connecter au panel")

                }
            })


            Client.restartServer(botMonitor.server_id).then((response) => {

            }).catch((error) => {
                console.log(error.response.statusText)
            });


            const hook = new Webhook(botMonitor.webhook)

            hook.send("✅ Redémarrage de votre bot <@" + botMonitor.bot_id + ">").then(() => {

                message.channel.send("Redémarrage lancé")

            }).catch(err => {
                return message.channel.send("⚠ Votre webhook ne fonctionne pas")



            })



        })
    }

}
module.exports.config = {
    category: "Utile",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["mon"],
    serverForced: false
}

module.exports.help = {
    description: "Commande pour gérer le système de monitoring du bot",
    utilisations: `monitor <add/list/remove/enable/disable/restart> <botid>`,
    exemples: "c!monitor add\nc!monitor enable `312877756197109760`"
}





function ValidURL(str) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(str)) {
        return false;
    } else {
        return true;
    }
}


/*

################################### PARTIE COMMANDES ###################################
/monitor add

--> mp demande url panel
--> mp demande clé api
--> mp demande identifiant serveur
--> mp demande webhook de log
--> id du bot à monitor

/monitor list
--> send en mp tous les monitor affiliés au compte


/monitor remove <iddubot/idduserveur>
--> mp êtes vous sur

/monitor enable <iddubot/idduserveur>

/monitor disable <iddubot/idduserveur>

################################### PARTIE MONITOR ###################################
] event presence update [
➔ check si l'id est en cours de monitor
➔ check si actif
➔ send via webhook
➔ requete de restart 


*/