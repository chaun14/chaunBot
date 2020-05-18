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
let messagesPerHoursHistory = new Map()


// entrée d'un nouveau message dans le système de calcun
function addMessage(message) {
    addMessagesPerSecond(message)
    addMessagesPerMinute(message)
    addMessagesPerHour(message)

}

// pas encore implémenté
function addMessagesPerSecond(message) {
    messagesPerSecond.add(message.id)
    setTimeout(function() { messagesPerSecond.delete(message.id) }, 1000);
}


// on ajoute 1 au compteur puis on delete au bout de une minute
function addMessagesPerMinute(message) {
    // on récupère les minutes 
    var minutes = getMinutes()



    // on regarde si le compteur à déjà une valeur mpm
    let minresult = messagesPerMinute.get(minutes)
    if (!minresult) minresult = 0


    // on ajoute 1 au compteur mpm
    messagesPerMinute.set(minutes, minresult + 1)




    // on supprime le compteur a ubout de une minute
    setTimeout(function() { messagesPerMinute.delete(minutes) }, 60000);

}

function addMessagesPerHour(message) {
    let hour = getHours()

    let hourresult = messagesPerHoursHistory.get(hour)
    if (!hourresult) hourresult = 0
    messagesPerHoursHistory.set(hour, hourresult + 1)

}


// on donne la map d'historique des messages par minute
function getMessagesPerMinuteHistory() {
    return messagesPerMinutesHistory
}


function getMessagesPerHourHistory() {
    return messagesPerHoursHistory
}

// on donne les messages par minutes en fonctione d'une minute donnée
function getMessagesPerMinute(minutes) {
    let result = messagesPerMinute.get(minutes)
    if (!result) result = 0
    return result
}





// fonction s'éxéutant toute les secondes

function mafonction() {
    // on récup les minutes d'aujourd'hui
    var minutes = getMinutes()
    let hour = getHours()



    // supprime tout ce qui est plus d'une heure
    var lastItem = Array.from(messagesPerMinutesHistory.keys())[0]
    if (lastItem < minutes - 60) {
        messagesPerMinutesHistory.delete(lastItem)

    }

    //on reset tout à minuit 
    if (minutes == 0) {
        messagesPerHoursHistory.clear()
        messagesPerMinutesHistory.clear()
    }


    if (messagesPerHoursHistory.length > 24) {
        messagesPerHoursHistory.delete(hour)

    }

    let hourresult = messagesPerHoursHistory.get(hour)
    if (!hourresult) hourresult = 0
    messagesPerHoursHistory.set(hour, hourresult)










    // on ajoute les messages passés dans l'historique
    messagesPerMinutesHistory.set(minutes, getMessagesPerMinute(minutes))

    //console.log(messagesPerHoursHistory)
    // go back in hour   console.log(Math.floor(minutes / 60) + "h" + minutes % 60)

}
setInterval(mafonction, 1000);



function getMinutes() {
    var d = new Date();
    var h = d.getHours();
    var n = d.getMinutes();
    var totalMinutes = h * 60 + n + 120


    return totalMinutes
}




function getHours() {
    var d = new Date();
    var h = d.getHours() + 2


    return h
}



module.exports = { addMessage, getMessagesPerMinute, getMessagesPerMinuteHistory, getMinutes, getHours, getMessagesPerHourHistory }