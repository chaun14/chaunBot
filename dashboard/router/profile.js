const express = require('express');
const router = express.Router();
const CheckAuth = require('../auth/CheckAuth');
let main = require("../../main.js")
router.get('/', CheckAuth, async(req, res) => {

    let botGuilds = req.bot.guilds.cache
    let userGuilds = req.user.guilds.filter(u => (u.permissions & 2146958591) === 2146958591)
    let withBotGuilds = []
    let withoutBotGuilds = []

    userGuilds.forEach(guild => {

        if (botGuilds.get(guild.id)) {
            withBotGuilds.push(guild)
        } else {
            withoutBotGuilds.push(guild)
        }

    });





    res.render("profile", {
        status: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : "Se connecter"),
        botclient: main.client.user,
        user: req.user,
        login: "oui",
        withBotGuilds: withBotGuilds,
        withoutBotGuilds: withoutBotGuilds,
        avatarURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
        iconURL: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png?size=32`,
        message: "",
        messageType: "success"
    });
});

module.exports = router;