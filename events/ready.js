const config = require("../informations/config");
const colorchalk = require("chalk");
const Discord = require("discord.js");
const chalk = new colorchalk.constructor({ level: 3 });
const moment = require("moment");
const db = require("../db.js")
var SqlString = require('sqlstring');

module.exports = async (client) => {
	console.log(chalk.greenBright(`${__filename.slice(__dirname.length + 1)}`)+chalk.reset(` : ${chalk.yellowBright(client.user.tag)} est allumé et présent sur ${chalk.magentaBright(client.guilds.size)} serveurs avec ${client.users.size} utilisateurs`));

client.user.setActivity(`bientôt de retour`, { type: 'STREAMING', url: 'https://www.twitch.tv/ftnl' });




console.log('\n_________ .__                       __________        __   \n\\_   ___ \\|  |__ _____   __ __  ____\\______   \\ _____\/  |_ \n\/    \\  \\\/|  |  \\\\__  \\ |  |  \\\/    \\|    |  _\/\/  _ \\   __\\\n\\     \\___|   Y  \\\/ __ \\|  |  \/   |  \\    |   (  <_> )  |  \n \\______  \/___|  (____  \/____\/|___|  \/______  \/\\____\/|__|  \n        \\\/     \\\/     \\\/           \\\/       \\\/             \n')

//updateUsername(client, db)

}

async function updateUsername(client, db) {
	
client.users.forEach(async user => {
	//	console.log(user.username)
	
	
		var date = moment().format('YYYY-MM-DD HH:mm:ss');
	/*
			console.log(SqlString.escape(user.username));
		
	
	
	
			let logUsername = `INSERT INTO userNameLogger(userId, oldUsername, newUsername, updateDate, reason) VALUES('${user.id}', NULL,${SqlString.escape(user.username)}, '${date}',"ajout au démarrage")`;
			db.query(logUsername, function (err, results, fields) {
				console.log("insert de " + user.username )
				if (err) {
					console.log(user.username + " à fail l'insert " +err.message);
				}
			})
		
	
	*/
	
	
	let checkIfNewUsernameExist = `SELECT
	*
	FROM
	userNameLogger
	WHERE
	userId = '${user.id}'
	AND newUsername = ${SqlString.escape(user.username)}
	ORDER BY updateDate DESC
	`
	
	//   AND newUsername = ${SqlString.escape(member.user.username)}
	//console.log(member.user.username)
	//  AND newUsername = '${member.username}'
	 db.query(checkIfNewUsernameExist, async function (err, results, fields) {
	  if (err) {
		console.log(err.message);
	  }
	 //console.log(results)
	console.log("processing "+ user.username)
	
	  if (results == undefined || results[0] == undefined) {
		let logUsername = `INSERT INTO userNameLogger(userId, oldUsername, newUsername, updateDate, reason) VALUES('${user.id}', NULL,${SqlString.escape(user.username)}, '${date}', "ajout au démarrage")`;
		db.query(logUsername, function (err, results, fields) {
			console.log("ajout de " +user.username + " en bdd car il n'existait pas")
		  if (err) {
			console.log(err.message);
		  }
		})
		return;
	  }
		if(results[0].newUsername !== user.username) {
		//	console.log(results)
		//	console.log("cc "+results[0].newUsername)
		//	console.log("cc "+user.username)
	
		  let logUsername = `INSERT INTO userNameLogger(userId, oldUsername, newUsername, updateDate, reason) VALUES('${user.id}', null,${SqlString.escape(user.username)}, '${date}', "ajout au démarrage ")`;
		db.query(logUsername, function (err, results, fields) {
			console.log("ajout de " +user.username + " en bdd car il a changé de pseudo pendant le down du bot")
		  if (err) {
			console.log(err.message);
		  }
		})
		}
	
	 
	})
	
	
	})
}