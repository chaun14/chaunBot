

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
  charset : 'utf8mb4_bin'
};

function handleDisconnect() {
  console.log("Connexion à la bdd")
    connection = mysql.createConnection(dbinfos);  // on recréé la new connexion

    
    connection.connect( function onConnect(err) {   // on se co
        if (err) {                                  
            console.log('error when connecting to db:', err);   // check si erreur
            hook.error('**Erreur connexion Mysql**', 'quelque chose s\'est mal passé', err.message) // log l'erreur
           
            setTimeout(handleDisconnect, 10000);    //  on test de se reco dans 10 secondes
        } else {                            // si tout va bieng


        console.log('connected as id ' + connection.threadId);    // on log l'id de la co car c'est stylé
        hook.success('**Mysql connecté**', 'tout va bien 👌', 'connected as id ' + connection.threadId) // log le succès
      }                                            
    });                                      
                                                   
    connection.on('error', function onError(err) {        // error handler
        console.log('db error', err);                     // on la log en console

        hook.error('**Erreur connexion Mysql**', 'quelque chose s\'est mal passé', err.message) // on la log en webhook
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {   // si on perd le serveur sql on se reco
            handleDisconnect();                        
        } else {                                                            // si c'est une autre erreur
          hook.send("@everyone")  // hop on prévient le proprio du bot                    
                                                       
            throw err;                                  // on renvoie l'erreur en console
        }
    });
}
handleDisconnect();                                    // on lance la fonction pour la première fois




let guildTable = `create table if not exists guildSettings(
        guildId varchar(255) primary key not null,
        prefix varchar(255),
        autoRole varchar(255)
    )`;

connection.query(guildTable, function (err, results, fields) {
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

connection.query(usernameTable, function (err, results, fields) {
if (err) {
console.log(err.message);
}
});


module.exports = connection