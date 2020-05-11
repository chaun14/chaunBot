const config = require("../informations/config");
const colorchalk = require("chalk");
const Discord = require("discord.js");
const chalk = new colorchalk.constructor({ level: 3 });
const moment = require("moment");
const db = require("../db.js")
var SqlString = require('sqlstring');



module.exports = async(client, member) => {

    //console.log(member)
    var date = moment().format('YYYY-MM-DD HH:mm:ss');


    let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${member.guild.id}';`;
    db.query(getGuildSetting, function(err, results, fields) {
        if (err) {
            console.log(err.message);
        }


        /* partie autorole */
        if (results[0].autoRole == null || results[0] == undefined) {

        } else {
            autoRole = JSON.parse(results[0].autoRole)

            if (autoRole.activated == true) {
                let roleToAdd = member.guild.roles.cache.find(role => role.id == autoRole.role)
                if (!member.guild.me.hasPermission("MANAGE_ROLES")) {
                    return
                }
                member.roles.add(roleToAdd, "Autorole activé").catch(err => console.log(err))
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
    db.query(checkIfNewUsernameExist, function(err, results, fields) {
        if (err) {
            console.log(err.message);
        }
        // console.log(results)

        if (results == undefined || results[0] == undefined) {
            let logUsername = `INSERT INTO userNameLogger(userId, oldUsername, newUsername, updateDate, reason) VALUES('${member.id}', NULL,${SqlString.escape(member.user.username)}, '${date}', "ajout par guildMemberJoin")`;
            db.query(logUsername, function(err, results, fields) {
                if (err) {
                    console.log(err.message);
                }
            })
            return;
        }
        if (results[0].newUsername !== member.user.username) {
            let logUsername = `INSERT INTO userNameLogger(userId, oldUsername, newUsername, updateDate, reason) VALUES('${member.id}', ${SqlString.escape(results[0].oldUsername)},${SqlString.escape(member.user.username)}, '${date}', "ajout par guildMemberJoin")`;
            db.query(logUsername, function(err, results, fields) {
                if (err) {
                    console.log(err.message);
                }
            })
        }


    })

}


/*
GuildMember {
  guild:
   Guild {
     members:
      Collection [Map] {
        '409875566800404480' => [GuildMember],
        '417977361011572747' => [GuildMember],
        '499595256270946326' => [GuildMember],
        '506157176566448130' => [GuildMember],
        '525813997241630732' => [GuildMember],
        '617497548743245835' => [GuildMember],
        '637662603564417024' => [GuildMember],
        '491276711389036588' => [Circular] },
     channels:
      Collection [Map] {
        '530686638016299039' => [CategoryChannel],
        '530686638016299040' => [TextChannel],
        '535213188552065028' => [CategoryChannel],
        '535213239601070080' => [TextChannel],
        '535213319817134085' => [TextChannel],
        '535213371725709333' => [TextChannel],
        '535213472980402187' => [TextChannel],
        '535377571441934336' => [CategoryChannel],
        '535377650731188224' => [TextChannel],
        '535389064363376641' => [TextChannel],
        '535421047588257792' => [TextChannel],
        '535469179239792650' => [TextChannel],
        '535796225929117699' => [TextChannel],
        '535801517505118208' => [TextChannel],
        '536332272111058954' => [TextChannel],
        '539721922649522176' => [TextChannel],
        '539722607059140608' => [TextChannel],
        '590946082062860297' => [VoiceChannel],
        '637298682823311371' => [CategoryChannel],
        '637298716893773824' => [TextChannel],
        '637316171179360276' => [TextChannel],
        '637316172425199626' => [TextChannel],
        '651024765426991125' => [VoiceChannel] },
     roles:
      Collection [Map] {
        '530686638016299038' => [Role],
        '535212971983372299' => [Role],
        '539726436316086273' => [Role],
        '539726482151571456' => [Role],
        '557923925322104854' => [Role],
        '617733038192853002' => [Role],
        '637289428666155018' => [Role],
        '637665045765029908' => [Role],
        '639162718191878174' => [Role],
        '659073877128773633' => [Role] },
     presences:
      Collection [Map] {
        '409875566800404480' => [Presence],
        '417977361011572747' => [Presence],
        '499595256270946326' => [Presence],
        '506157176566448130' => [Presence],
        '617497548743245835' => [Presence],
        '491276711389036588' => [Presence] },
     deleted: false,
     available: true,
     id: '530686638016299038',
     name: 'Dashboard',
     icon: '9b607e1399497169c9de5c6e4fda5dd1',
     splash: null,
     region: 'eu-west',
     memberCount: 8,
     large: false,
     features: [],
     applicationID: null,
     afkTimeout: 300,
     afkChannelID: null,
     systemChannelID: '530686638016299040',
     embedEnabled: undefined,
     verificationLevel: 0,
     explicitContentFilter: 0,
     mfaLevel: 0,
     joinedTimestamp: 1547675116285,
     defaultMessageNotifications: 'ALL',
     ownerID: '417977361011572747',
     _rawVoiceStates: Collection [Map] {},
     emojis:
      Collection [Map] {
        '630656207274901511' => [Emoji],
        '630656388087152640' => [Emoji],
        '630656482945269760' => [Emoji],
        '630656601703055380' => [Emoji],
        '630656782439678003' => [Emoji],
        '630656868380835871' => [Emoji],
        '630657106848251915' => [Emoji],
        '630659532023922708' => [Emoji],
        '630659627020976128' => [Emoji],
        '630659890062426112' => [Emoji],
        '630660219483062274' => [Emoji],
        '630660383618760736' => [Emoji],
        '630660472206786563' => [Emoji],
        '630660618529144842' => [Emoji],
        '630675749015126026' => [Emoji],
        '644296843089543178' => [Emoji] } },
  user:
   User {
     id: '491276711389036588',
     username: 'chaun14²',
     discriminator: '7107',
     avatar: '67ecc0b996c9b41bec0bfe5d044b00f5',
     bot: false,
     lastMessageID: null,
     lastMessage: null },
  joinedTimestamp: 1577884061701,
  _roles: [],
  serverDeaf: false,
  serverMute: false,
  selfMute: undefined,
  selfDeaf: undefined,
  voiceSessionID: undefined,
  voiceChannelID: undefined,
  speaking: false,
  nickname: null,
  lastMessageID: null,
  lastMessage: null,
  deleted: false }


*/