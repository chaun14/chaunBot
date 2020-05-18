const express = require('express');
const router = express.Router();
const passport = require("passport");
const CheckAuth = require('../auth/CheckAuth');
const stats = require("../../modules/stats");

router.get("/", function(req, res) {
    let MessagesPerMinuteHistory = stats.getMessagesPerMinuteHistory()
    let MessagesPerHourHistory = stats.getMessagesPerHourHistory()



    res.render("status.ejs", {
        status: (req.isAuthenticated() ? `${req.user.username}#${req.user.discriminator}` : "Se connecter"),
        botclient: req.bot.user,
        user: req.user,
        login: (req.isAuthenticated() ? "oui" : "non"),
        invite: `https://discordapp.com/oauth2/authorize?client_id=${req.bot.user.id}&scope=bot&permissions=-1`,
        message: "",
        messageType: "success",
        MessagesPerMinuteHistory,
        MessagesPerHourHistory: MessagesPerHourHistory
    });
})



module.exports = router;