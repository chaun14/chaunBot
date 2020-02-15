var mysql = require('mysql');
const config = require("./informations/config");

const connection = mysql.createConnection({
  host: config.db.host,
  user: config.db.username,
  password: config.db.password,
  database: config.db.name,
  charset : 'utf8mb4_bin'
});

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log(results);
});



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