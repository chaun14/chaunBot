const express = require("express");
const session = require("express-session");
const moment = require("moment");

const app = express();



const passport = require("passport");
const { Strategy } = require("passport-discord");
const bodyparser = require("body-parser");
const path = require("path");
const morgan = require('morgan')
const config = require("../informations/config");

module.exports.load = async(client) => {
    const stats = require("../modules/stats");
    const http = require('http').createServer(app);
    const io = require('socket.io')(http);

    function mafonction() {

        var minutes = stats.getMinutes()
        let hour = stats.getHours()

        io.emit('msgPerHour', { mph: stats.getMessagesPerHourHistory().get(hour), hour: hour })
        io.emit('msgPerMin', { mpm: stats.getMessagesPerMinute(minutes), minute: minutes })

    }
    setInterval(mafonction, 1000);



    io.on('connection', (socket) => {
        console.log('a user connected');
        // io.emit('message', { msg: 'some value', type: 'error' }); // This will emit the event to all connected sockets

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });





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
        .use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'))
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
        .use("/status", require("./router/status"))
        .get("*", function(req, res) {
            res.redirect("/");
        });


    http.listen(app.get('port'), (err) => {

        if (err) throw err;
        console.log(`Dashboard online on port ${app.get('port')}`);
    });









    process.on("unhandledRejection", (r) => {
        console.dir(r);
    });
};