const express = require("express");
const session = require("express-session");
const app = express();
const passport = require("passport");
const { Strategy } = require("passport-discord");
const bodyparser = require("body-parser");
const path = require("path");
const config = require("../informations/config");
module.exports.load = async(client) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });

    let scopes = ["identify", "guilds"];

    passport.use(new Strategy({
        clientID: client.user.id,
        clientSecret: config.client_secret,
        callbackURL: `${config.panel_url}/login`,
        scope: scopes
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    }));

    app
        .use(bodyparser.json())
        .use(bodyparser.urlencoded({ extended: true }))
        .engine("html", require("ejs").renderFile)
        .use(express.static(path.join(__dirname, "/public")))
        .set("view engine", "ejs")
        .set("views", path.join(__dirname, "views"))
        .set('port', process.env.PORT || config.port)
        .use(session({
            secret: config.panel_secret,
            resave: false,
            saveUninitialized: false
        }))
        .use(passport.initialize())
        .use(passport.session())
        .use(function(req, res, next) {
            req.bot = client;
            next();
        })
        .use("/", require("./router/index"))
        .use("/profile", require("./router/profile"))
        .use("/serveurs", require("./router/serveurs"))
        .get("*", function(req, res) {
            res.redirect("/");
        });

    app
        .listen(app.get('port'), (err) => {
            if (err) throw err;
            console.log(`Dashboard online on port ${app.get('port')}`);
        });

    process.on("unhandledRejection", (r) => {
        console.dir(r);
    });
};