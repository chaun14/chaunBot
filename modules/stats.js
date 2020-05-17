const config = require("../informations/config");
const colors = require('colors');
const Discord = require("discord.js");
const moment = require("moment");
const db = require("../db.js")
var SqlString = require('sqlstring');
const debug = config.debug



let messagesPerSecond = new Set()
let messagesPerMinute = new Map()
let messagesPerMinutesHistory = new Map()


function addMessage(message) {
    addMessagesPerSecond(message)
    addMessagesPerMinute(message)

    console.log("cc")

}



function addMessagesPerSecond(message) {
    messagesPerSecond.add(message.id)
    setTimeout(function() { messagesPerSecond.delete(message.id) }, 1000);

}

function addMessagesPerMinute(message) {
    var m = moment(new Date());
    var minutes = (m.hour() * 60) + m.minute();

    let result = messagesPerMinute.get(minutes)
    if (!result) result = 0


    messagesPerMinute.set(minutes, result + 1)
    setTimeout(function() { messagesPerMinute.delete(minutes) }, 60000);

}

function getMessagesPerMinuteHistory() {
    return messagesPerMinutesHistory
}



function getMessagesPerMinute(minutes) {
    let result = messagesPerMinute.get(minutes)
    if (!result) result = 0
    return result
}


function mafonction() {
    var m = moment(new Date());
    var minutes = (m.hour() * 60) + m.minute();



    // supprime tout ce qui est plus d'une heure
    var lastItem = Array.from(messagesPerMinutesHistory.keys())[0]

    if (lastItem < minutes - 60) {

        messagesPerMinutesHistory.delete(lastItem)
    }

    messagesPerMinutesHistory.set(minutes, getMessagesPerMinute(minutes))

    //console.log(messagesPerMinutesHistory)


    // go back in hour   console.log(Math.floor(minutes / 60) + "h et " + minutes % 60)

}
setInterval(mafonction, 1000);





module.exports = { addMessage, getMessagesPerMinute, getMessagesPerMinuteHistory }