var mysql = require('mysql');
const config = require("./informations/config");

var dbinfos = {
  host: config.db.host,
  user: config.db.username,
  password: config.db.password,
  database: config.db.name,
  charset : 'utf8mb4_bin'
};

function handleDisconnect() {
  console.log("Connexion à la bdd")
    connection = mysql.createConnection(dbinfos);  // Recreate the connection, since the old one cannot be reused.
    connection.connect( function onConnect(err) {   // The server is either down
        if (err) {                                  // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 10000);    // We introduce a delay before attempting to reconnect,
        }           
        console.log('connected as id ' + connection.threadId);                                
                                                    // to avoid a hot loop, and to allow our node script to
    });                                             // process asynchronous requests in the meantime.
                                                    // If you're also serving http, display a 503 error.
    connection.on('error', function onError(err) {
        console.log('db error', err);
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {   // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                        // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}
handleDisconnect();




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