const config = require("../informations/config");
const colors = require('colors');
const Discord = require("discord.js");
const moment = require("moment");
const db = require("../db.js")
var SqlString = require('sqlstring');
const debug = config.debug


async function getGuildSettings(guildid, callback) {
    let guildSetting = `SELECT * FROM guildSettings WHERE guildId = ${SqlString.escape(guildid)};`;

    await db.query(guildSetting, function(err, settings, fields) {
        if (err) console.log(err.message);

        if (debug) {
            console.log("guildSetting " + guildSetting + "\n" + JSON.stringify(settings))
        }
        callback(err, settings);
    })
}


async function setAutoRole(guildid, json, callback) {
    let setAutoRole = `UPDATE guildSettings SET autoRole = ${SqlString.escape(json)} WHERE guildId = ${SqlString.escape(guildid)};`;
    db.query(setAutoRole, function(err, results, fields) {
        if (err)
            console.log("erreur pour setAutoRole config" + err.message);


        if (debug) {
            console.log("setAutoRole " + setAutoRole + +JSON.stringify(results))
        }
        callback(err, results);
    })

}

module.exports = { getGuildSettings, setAutoRole }