const colorchalk = require("chalk");
const Discord = require("discord.js");

const db = require("../db.js")

const node = require('nodeactyl');
const { Webhook, MessageBuilder } = require('discord-webhook-node');

let antiDupli = new Set();

let antiOnlineDupli = new Set();

let samePresenceHandler = new Set();

module.exports = async(client, oldPresence, newPresence) => {


    if (newPresence.status == "offline") {

        /* Pour commencer on vérifie si le bot est surveillé */
        let getUserMonitors = `SELECT * FROM monitors WHERE bot_id = '${newPresence.member.id}';`
        db.query(getUserMonitors, async function(err, monitors, fields) {
            if (err) throw err;

            if (monitors[0] == undefined) return

            if (monitors[0].active == 0) return


            if (antiDupli.has(newPresence.member.id)) return
            samePresenceHandler.delete(newPresence.member.id)
            antiDupli.add(newPresence.member.id);

            const hook = new Webhook(monitors[0].webhook);

            const embed = new MessageBuilder()
                .setAuthor("💢 Monitor offline")
                .setDescription(`Votre bot <@${newPresence.member.id}> est passé offline sur le serveur ${newPresence.guild}\n*Si il est encore offline dans une minute, il sera redémarré*`)
                .setFooter(client.user.username, client.user.avatarURL())
                .setTimestamp()
                .setColor(3553599)

            hook.send(embed).catch(err => { console.log(err) })

            function checkPresence() {
                antiDupli.delete(newPresence.member.id);

                let monBot = newPresence.guild.members.cache.get(newPresence.member.id)
                if (!monBot) return
                if (monBot.presence.status == "offline") {

                    const embed2 = new MessageBuilder()
                        .setAuthor("💥 Redémarrage")
                        .setDescription(`Votre bot <@${newPresence.member.id}> ne s'est pas reconnecté. Je vais devoir le redémarrer`)
                        .setFooter(client.user.username, client.user.avatarURL())
                        .setTimestamp()
                        .setColor(3553599)

                    hook.send(embed2).catch(err => { console.log(err) })


                    let pteroClient = node.Client;
                    pteroClient.login(monitors[0].panel_url, monitors[0].api_key, (logged_in, msg) => {
                        if (!logged_in) {
                            const embed3 = new MessageBuilder()
                                .setAuthor("❌ Erreur")
                                .setDescription(`Je ne parviens pas à redémarrer <@${newPresence.member.id}> merci de vérifier l'url du panel et la clé api.`)
                                .setFooter(client.user.username, client.user.avatarURL())
                                .setTimestamp()
                                .setColor(3553599)

                            hook.send(embed3).catch(err => { console.log(err) })
                            return
                        } else {


                            pteroClient.restartServer(monitors[0].server_id).then((response) => {
                                const embed4 = new MessageBuilder()
                                    .setAuthor("♻ Redémarrage lancé")
                                    .setDescription(`Votre bot <@${newPresence.member.id}> est en cours de redémarrage.`)
                                    .setFooter(client.user.username, client.user.avatarURL())
                                    .setTimestamp()
                                    .setColor(3553599)

                                hook.send(embed4).catch(err => { console.log(err) })

                            }).catch((error) => {
                                const embed5 = new MessageBuilder()
                                    .setAuthor("❌ Erreur")
                                    .setDescription(`Je ne parviens pas à redémarrer <@${newPresence.member.id}> merci de vérifier l'id du serveur.`)
                                    .setFooter(client.user.username, client.user.avatarURL())
                                    .setTimestamp()
                                    .setColor(3553599)

                                hook.send(embed5).catch(err => { console.log(err) })
                            });



                        }
                    })




                }


            }

            function removeFromAntiDupli() {
                antiDupli.delete(newPresence.member.id)

            }
            setTimeout(removeFromAntiDupli, 5000);
            setTimeout(checkPresence, 60000);


        })
    } else {

        /* Pour commencer on vérifie si le bot est surveillé */
        let getUserMonitors = `SELECT * FROM monitors WHERE bot_id = '${newPresence.member.id}';`
        db.query(getUserMonitors, async function(err, monitors, fields) {
            if (err) throw err;

            if (monitors[0] == undefined) return

            if (monitors[0].active == 0) return

            if (oldPresence)
                if (oldPresence.status == "online") return

            if (antiOnlineDupli.has(newPresence.member.id)) return
            if (samePresenceHandler.has(newPresence.member.id)) return

            samePresenceHandler.add(newPresence.member.id)
            antiOnlineDupli.add(newPresence.member.id)


            const hook = new Webhook(monitors[0].webhook);

            const embed = new MessageBuilder()
                .setAuthor("✅ Monitor en ligne")
                .setDescription(`Votre bot <@${newPresence.member.id}> est passé en ligne sur le serveur ${newPresence.guild}`)
                .setFooter(client.user.username, client.user.avatarURL())
                .setTimestamp()
                .setColor(3553599)

            hook.send(embed).catch(err => { console.log(err) })


            function removeFromAntiDupli() {
                antiOnlineDupli.delete(newPresence.member.id)

            }

            setTimeout(removeFromAntiDupli, 5000);
        })




    }


}