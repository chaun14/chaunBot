
const config = require("../informations/config");
const colorchalk = require("chalk");
const Discord = require("discord.js");
const chalk = new colorchalk.constructor({ level: 3 });
const moment = require("moment");
const db = require("../db.js")
var SqlString = require('sqlstring');



module.exports = async (client, member) => {

  //console.log(member)
  var date = moment().format('YYYY-MM-DD HH:mm:ss');


  let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${member.guild.id}';`;
  db.query(getGuildSetting, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    }


    /* partie autorole */
    if (results[0].autoRole == null || results[0] == undefined) {

    } else {
      autoRole = JSON.parse(results[0].autoRole)

      if (autoRole.activated == true) {
        let roleToAdd = member.guild.roles.find(role => role.id == autoRole.role)
        if (!member.guild.me.hasPermission("MANAGE_ROLES")) {
          return
        }
        member.addRole(roleToAdd, "Autorole activé").catch(err => console.log(err))
      }
    }

  });



  let checkIfNewUsernameExist = `SELECT
  *
FROM
  userNameLogger
WHERE
  userId = '${member.id}'
  AND newUsername = ${SqlString.escape(member.user.username)}
ORDER BY updateDate
`

//   AND newUsername = ${SqlString.escape(member.user.username)}
  //console.log(member.user.username)
  //  AND newUsername = '${member.username}'
  db.query(checkIfNewUsernameExist, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    }
   // console.log(results)

    if (results == undefined || results[0] == undefined) {
      let logUsername = `INSERT INTO userNameLogger(userId, oldUsername, newUsername, updateDate, reason) VALUES('${member.id}', NULL,${SqlString.escape(member.user.username)}, '${date}', "ajout par guildMemberJoin")`;
      db.query(logUsername, function (err, results, fields) {
        if (err) {
          console.log(err.message);
        }
      })
      return;
    }
      if(results[0].newUsername !== member.user.username) {
        let logUsername = `INSERT INTO userNameLogger(userId, oldUsername, newUsername, updateDate, reason) VALUES('${member.id}', ${SqlString.escape(results[0].oldUsername)},${SqlString.escape(member.user.username)}, '${date}', "ajout par guildMemberJoin")`;
      db.query(logUsername, function (err, results, fields) {
        if (err) {
          console.log(err.message);
        }
      })
      }

   
  })

}

