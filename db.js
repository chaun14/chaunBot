var mysql = require('mysql');
const config = require("./informations/config");
const webhook = require('discord-webhook-node');
//if(config.logWebhook = undefined) throw new Error('veuillez spécifier un webhook dans la config')
const hook = new webhook.Webhook(config.logWebhook);

var dbinfos = {
    host: config.db.host,
    user: config.db.username,
    password: config.db.password,
    database: config.db.name,
    charset: 'utf8mb4_bin'
};

function handleDisconnect() {
    console.log("Connexion à la bdd")
    connection = mysql.createConnection(dbinfos); // on recréé la new connexion


    connection.connect(function onConnect(err) { // on se co
        if (err) {
            console.log('error when connecting to db:', err); // check si erreur
            hook.error('**Erreur connexion Mysql**', 'quelque chose s\'est mal passé', err.message) // log l'erreur

            setTimeout(handleDisconnect, 10000); //  on test de se reco dans 10 secondes
        } else { // si tout va bieng


            console.log('connected as id ' + connection.threadId); // on log l'id de la co car c'est stylé
            hook.success('**Mysql connecté**', 'tout va bien 👌', 'connected as id ' + connection.threadId) // log le succès
        }
    });

    connection.on('error', function onError(err) { // error handler
        console.log('db error', err); // on la log en console

        hook.error('**Erreur connexion Mysql**', 'quelque chose s\'est mal passé', err.message) // on la log en webhook
        if (err.code == 'PROTOCOL_CONNECTION_LOST') { // si on perd le serveur sql on se reco
            handleDisconnect();
        } else { // si c'est une autre erreur
            hook.send("@everyone") // hop on prévient le proprio du bot                    

            throw err; // on renvoie l'erreur en console
        }
    });
}
handleDisconnect(); // on lance la fonction pour la première fois




let guildTable = `create table if not exists guildSettings(
        guildId varchar(255) COLLATE latin1_bin primary key not null,
        prefix varchar(255),
        autoRole text COLLATE utf8mb4_bin,
        no_txt text COLLATE utf8mb4_bin,
        updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;

connection.query(guildTable, function(err, results, fields) {
    if (err) {
        console.log(err.message);
    }
});



let botTable = `create table if not exists botSettings(
    bot_id varchar(255) COLLATE latin1_bin primary key not null,
    statsSave text COLLATE utf8mb4_bin,
    updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
)`;

connection.query(botTable, function(err, results, fields) {
    if (err) {
        console.log(err.message);
    }
});

let usernameTable = `create table if not exists userNameLogger(
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  userId varchar(255) not null,
  oldUsername varchar(255),
  newUsername varchar(255),
  updateDate TIMESTAMP,
  reason varchar(255)
)DEFAULT CHARSET=utf8mb4`;

connection.query(usernameTable, function(err, results, fields) {
    if (err) {
        console.log(err.message);
    }
});


let monitorsTable = `CREATE TABLE if not exists monitors (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  owner_id varchar(255) COLLATE utf8mb4_bin NOT NULL,
  bot_id varchar(255) COLLATE utf8mb4_bin NOT NULL,
  bot_name varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  server_id varchar(255) COLLATE utf8mb4_bin NOT NULL,
  panel_url varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  api_key varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  active tinyint(1) NOT NULL DEFAULT '1',
  webhook varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;`
connection.query(monitorsTable, function(err, results, fields) {
    if (err) {
        console.log(err.message);
    }
});
let warnsTable = `
CREATE TABLE IF NOT EXISTS warns (
    id int(255) NOT NULL AUTO_INCREMENT,
    guild_id varchar(255) COLLATE utf8mb4_bin NOT NULL,
    user_id varchar(255) COLLATE utf8mb4_bin NOT NULL,
    warner_id varchar(255) COLLATE utf8mb4_bin NOT NULL,
    type enum('manual','auto') COLLATE utf8mb4_bin NOT NULL,
    reason text COLLATE utf8mb4_bin NOT NULL,
    updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  ) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='vive les warns';`
connection.query(warnsTable, function(err, results, fields) {
    if (err) {
        console.log(err.message);
    }
});
module.exports = connection