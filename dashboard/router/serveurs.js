const express = require('express');
const router = express.Router();
const CheckAuth = require('../auth/CheckAuth');
let sql = require("../../modules/sql.js")


router.get("/:guildID", CheckAuth, (req, res) => {

    console.log(req.params)

    let serv = req.bot.guilds.cache.get(req.params.guildID);
    if (!serv) return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${req.bot.user.id}&scope=bot&permissions=-1&guild_id=${req.params.guildID}`);
    if (!req.bot.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).hasPermission("MANAGE_GUILD")) return res.redirect("/dashboard");
    res.render("guild", {
        status: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : "Se connecter"),
        botclient: req.bot.user,
        user: req.user,
        login: "oui",
        guild: serv,
        avatarURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
        iconURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=32`,
        message: "",
        messageType: "success"
    });
}).get("/:guildID/moderation", CheckAuth, (req, res) => {

    let parameters = [{
        name: "Warns",
        desc: "Tout ce qui concerne les avertissements",
        icon: "add_circle_outline",
        target: `/serveurs/${req.params.guildID}/tools/autorole`
    }];



    let serv = req.bot.guilds.cache.get(req.params.guildID);
    if (!serv) return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${req.bot.user.id}&scope=bot&permissions=-1&guild_id=${req.params.guildID}`);
    if (!req.bot.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).hasPermission("MANAGE_GUILD")) return res.redirect("/dashboard");

    res.render("categorie", {
        status: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : "Se connecter"),
        botclient: req.bot.user,
        user: req.user,
        login: "oui",
        guild: serv,
        avatarURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
        iconURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=32`,
        categorie: "modération",
        parameters: parameters,
        message: "",
        messageType: "success"
    })
}).get("/:guildID/tools", CheckAuth, (req, res) => {

    let parameters = [{
        name: "Auto-rôle",
        desc: "Donnez automatiquement un rôle à un membre à son arrivée",
        icon: "add_circle_outline",
        target: `/serveurs/${req.params.guildID}/tools/autorole`
    }, {
        name: "Notxt - Auto-hastebin",
        desc: "Générez automatiquement un lien hastebin des fichiers textes envoyés",
        icon: "text_fields",
        target: `/serveurs/${req.params.guildID}/tools/notxt`
    }];



    let serv = req.bot.guilds.cache.get(req.params.guildID);
    if (!serv) return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${req.bot.user.id}&scope=bot&permissions=-1&guild_id=${req.params.guildID}`);
    if (!req.bot.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).hasPermission("MANAGE_GUILD")) return res.redirect("/dashboard");

    res.render("categorie", {
        status: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : "Se connecter"),
        botclient: req.bot.user,
        user: req.user,
        login: "oui",
        guild: serv,
        avatarURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
        iconURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=32`,
        categorie: "Outils",
        parameters: parameters,
        message: "",
        messageType: "success"
    });



}).get("/:guildID/tools/autorole", CheckAuth, async(req, res) => {





    let serv = req.bot.guilds.cache.get(req.params.guildID);
    if (!serv) return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${req.bot.user.id}&scope=bot&permissions=-1&guild_id=${req.params.guildID}`);
    if (!req.bot.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).hasPermission("MANAGE_GUILD")) return res.redirect("/dashboard");


    await sql.getGuildSettings(req.params.guildID, async(err, settings) => {
        let autoRoleSettings = JSON.parse(settings[0].autoRole)
        if (settings[0].autoRole == null) {
            autoRoleSettings = {
                "activated": false,
                "role": "",
            }
        }



        res.render("items/autorole", {
            status: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : "Se connecter"),
            botclient: req.bot.user,
            user: req.user,
            login: "oui",
            guild: serv,
            avatarURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
            iconURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=32`,
            autoRoleSettings: autoRoleSettings,
            message: "",
            messageType: "success"
        });

    })

}).post("/:guildID/tools/autorole", CheckAuth, async function(req, res) {


    let serv = req.bot.guilds.cache.get(req.params.guildID);
    if (!serv) return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${req.bot.user.id}&scope=bot&permissions=-1&guild_id=${req.params.guildID}`);
    if (!req.bot.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).hasPermission("MANAGE_GUILD")) return res.redirect("/dashboard");





    if (!req.body.roleid || req.body.roleid === "NOT_SET") {
        await sql.getGuildSettings(req.params.guildID, async(err, settings) => {
            let autoRoleSettings = JSON.parse(settings[0].autoRole)
            if (settings[0].autoRole == null) {
                autoRoleSettings = {
                    "activated": false,
                    "role": "",
                }
            }


            res.render("items/autorole", {
                status: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : "Se connecter"),
                botclient: req.bot.user,
                user: req.user,
                login: "oui",
                guild: serv,
                avatarURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
                iconURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=32`,
                autoRoleSettings: autoRoleSettings,
                message: "Veuillez spécifier un rôle",
                messageType: "error"
            });
        });
        return
    }


    let jsonObj = {
        "activated": req.body.status ? true : false,
        "role": req.body.roleid
    }
    json = JSON.stringify(jsonObj);

    sql.setAutoRole(req.params.guildID, json, async(err, result) => {
        await sql.getGuildSettings(req.params.guildID, async(err, settings) => {
            let autoRoleSettings = JSON.parse(settings[0].autoRole)
            if (settings[0].autoRole == null) {
                autoRoleSettings = {
                    "activated": false,
                    "role": "",
                }
            }



            if (err) {

                res.render("items/autorole", {
                    status: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : "Se connecter"),
                    botclient: req.bot.user,
                    user: req.user,
                    login: "oui",
                    guild: serv,
                    avatarURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
                    iconURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=32`,
                    autoRoleSettings: autoRoleSettings,
                    message: "Erreur lors de la sauvegarde",
                    messageType: "error"
                });

            } else {




                res.render("items/autorole", {
                    status: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : "Se connecter"),
                    botclient: req.bot.user,
                    user: req.user,
                    login: "oui",
                    guild: serv,
                    avatarURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
                    iconURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=32`,
                    autoRoleSettings: autoRoleSettings,
                    message: "Modifications appliquées",
                    messageType: "success"
                });





            }
        });
    })

    /*
    .post("/:guildID", CheckAuth, async function(req, res) {
        if (!req.body.send_CHANNELID || req.body.send_CHANNELID === "NOT_SET") return res.send("Erreur, pas de salon spécifié");
        if (!req.body.send_MESSAGE || req.body.send_MESSAGE.length === 0) return res.send("Erreur, pas de message spécifié");
        await req.bot.guilds.get(req.params.guildID).channels.get(req.body.send_CHANNELID).send(req.body.send_MESSAGE);
        await res.redirect(`/serveurs/${req.params.guildID}`);
    });*/
    /*
    if (!req.body.send_CHANNELID || req.body.send_CHANNELID === "NOT_SET") return res.send("Erreur, pas de salon spécifié");
    if (!req.body.send_MESSAGE || req.body.send_MESSAGE.length === 0) return res.send("Erreur, pas de message spécifié");
    await req.bot.guilds.get(req.params.guildID).channels.get(req.body.send_CHANNELID).send(req.body.send_MESSAGE);
    */
}).get("/:guildID/tools/notxt", CheckAuth, async(req, res) => {





    let serv = req.bot.guilds.cache.get(req.params.guildID);
    if (!serv) return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${req.bot.user.id}&scope=bot&permissions=-1&guild_id=${req.params.guildID}`);
    if (!req.bot.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).hasPermission("MANAGE_GUILD")) return res.redirect("/dashboard");


    await sql.getGuildSettings(req.params.guildID, async(err, settings) => {
        let notxtSettings = JSON.parse(settings[0].no_txt)
        if (settings[0].no_txt == null) {
            notxtSettings = {
                "activated": false
            }
        }



        res.render("items/notxt", {
            status: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : "Se connecter"),
            botclient: req.bot.user,
            user: req.user,
            login: "oui",
            guild: serv,
            avatarURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
            iconURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=32`,
            notxtSettings,
            message: "",
            messageType: "success"
        });

    })

}).post("/:guildID/tools/notxt", CheckAuth, async function(req, res) {


    let serv = req.bot.guilds.cache.get(req.params.guildID);
    if (!serv) return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${req.bot.user.id}&scope=bot&permissions=-1&guild_id=${req.params.guildID}`);
    if (!req.bot.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).hasPermission("MANAGE_GUILD")) return res.redirect("/dashboard");

    let jsonObj = {
        "activated": req.body.status ? true : false
    }
    json = JSON.stringify(jsonObj);

    sql.setNoTxt(req.params.guildID, json, async(err, result) => {
        await sql.getGuildSettings(req.params.guildID, async(err, settings) => {
            let notxtSettings = JSON.parse(settings[0].no_txt)
            if (settings[0].no_txt == null) {
                notxtSettings = {
                    "activated": false
                }
            }



            if (err) {

                res.render("items/notxt", {
                    status: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : "Se connecter"),
                    botclient: req.bot.user,
                    user: req.user,
                    login: "oui",
                    guild: serv,
                    avatarURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
                    iconURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=32`,
                    notxtSettings,
                    message: "Erreur lors de la sauvegarde",
                    messageType: "error"
                });

            } else {




                res.render("items/notxt", {
                    status: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : "Se connecter"),
                    botclient: req.bot.user,
                    user: req.user,
                    login: "oui",
                    guild: serv,
                    avatarURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
                    iconURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=32`,
                    notxtSettings,
                    message: "Modifications appliquées",
                    messageType: "success"
                });





            }
        });
    })

    /*
    .post("/:guildID", CheckAuth, async function(req, res) {
        if (!req.body.send_CHANNELID || req.body.send_CHANNELID === "NOT_SET") return res.send("Erreur, pas de salon spécifié");
        if (!req.body.send_MESSAGE || req.body.send_MESSAGE.length === 0) return res.send("Erreur, pas de message spécifié");
        await req.bot.guilds.get(req.params.guildID).channels.get(req.body.send_CHANNELID).send(req.body.send_MESSAGE);
        await res.redirect(`/serveurs/${req.params.guildID}`);
    });*/
    /*
    if (!req.body.send_CHANNELID || req.body.send_CHANNELID === "NOT_SET") return res.send("Erreur, pas de salon spécifié");
    if (!req.body.send_MESSAGE || req.body.send_MESSAGE.length === 0) return res.send("Erreur, pas de message spécifié");
    await req.bot.guilds.get(req.params.guildID).channels.get(req.body.send_CHANNELID).send(req.body.send_MESSAGE);
    */
});
module.exports = router;