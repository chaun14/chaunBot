
const config = require("../informations/config");
const colorchalk = require("chalk");
const Discord = require("discord.js");
const chalk = new colorchalk.constructor({ level: 3 });
const moment = require("moment");
const db = require("../db.js")
var SqlString = require('sqlstring');


module.exports = async (client, oldUser, newUser) => {
/*
console.log("▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫ UserUpdate ▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫▫")
console.log(oldUser)
console.log(newUser)
*/
var date = moment().format('YYYY-MM-DD HH:mm:ss');



/* déja on cherche si c'est le pseudo ou la pdp ou rien qui à été update */ 

if (oldUser.username !== newUser.username) {
    console.log("changement de pseudo de " + oldUser.username + " en "+ newUser.username)

    let logUsername = `INSERT INTO userNameLogger(userId, oldUsername, newUsername, updateDate, reason) VALUES('${newUser.id}', ${SqlString.escape(oldUser.username)},${SqlString.escape(newUser.username)}, '${date}', "ajout par userupdate")`;
        
    db.query(logUsername, function (err, results, fields) {
        if (err) {
            console.log(err.message + " updatepseudo query: " + logUsername);
        }
    })



}
if (oldUser.avatar !== newUser.avatar) {
  //  console.log("changement de pdp de " + newUser.username )

}

if (oldUser.discriminator !== newUser.discriminator) {
 //   console.log("changement de tag")

}


}
/*
exemple

User {
  id: '491276711389036588',
  username: 'chaun14²',
  discriminator: '7107',
  avatar: '67ecc0b996c9b41bec0bfe5d044b00f5',
  bot: false,
  lastMessageID: null,
  lastMessage: null }
User {
  id: '491276711389036588',
  username: 'chaun14²',
  discriminator: '7107',
  avatar: '049f00979475a8c2d434a7bb09e526c7',
  bot: false,
  lastMessageID: null,
  lastMessage: null }


*/