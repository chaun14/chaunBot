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
            console.log("setAutoRole " + setAutoRole + JSON.stringify(results))
        }
        callback(err, results);
    })

}

async function setNoTxt(guildid, json, callback) {
    let setNoTxt = `UPDATE guildSettings SET no_txt = ${SqlString.escape(json)} WHERE guildId = ${SqlString.escape(guildid)};`;
    db.query(setNoTxt, function(err, results, fields) {
        if (err)
            console.log("erreur pour setNoTxt config" + err.message);


        if (debug) {
            console.log("setNoTxt " + setNoTxt + JSON.stringify(results))
        }
        callback(err, results);
    })

}

async function saveStats(botid, json, callback) {
    let saveStats = `UPDATE botSettings SET statsSave = ${SqlString.escape(json)} WHERE bot_id = ${SqlString.escape(botid)};`;
    db.query(saveStats, function(err, results, fields) {
        if (err)
            console.log("erreur pour saveStats config" + err.message);


        if (debug) {
            console.log("saveStats " + saveStats + JSON.stringify(results))
        }
        callback(err, results);
    })

}
async function getStats(botid, callback) {
    let getStats = `SELECT * FROM botSettings WHERE bot_id = ${SqlString.escape(botid)};`;
    db.query(getStats, function(err, results, fields) {
        if (err)
            console.log("erreur pour getStats " + err.message);


        if (debug) {
            console.log("getStats " + getStats + JSON.stringify(results))
        }
        callback(err, results);
    })

}





module.exports = { getGuildSettings, setAutoRole, setNoTxt, saveStats, getStats }