const Discord = require("discord.js");
const fs = require("fs");
const colors = require('colors');
const chalk = require("chalk");
const recursive = require("recursive-readdir");

const client = new Discord.Client();
const configBOT = require("./informations/config");
client.login(configBOT.token);


const webhook = require('discord-webhook-node');
const hook = new webhook.Webhook(configBOT.logWebhook);


// on met le dasboard dans l'objet client pour pouvoir le lancer quand le bot est pret
client.website = require("./dashboard/dashboard.js");


// déclare quelques objets de fonctionnement du command handler
let fileNumber = 0;
client.commands = new Map();
client.aliases = new Map();


// on lis notre dossier event pour extraire les event et les bind
fs.readdir('./events/', (err, files) => {
    console.log(("\n\nLancement du bot.\n\n").brightRed);

    console.log(`\nÉvènements : (` +
        `${files.length}`.bold.yellow + ")");

    // les erreurs c'est méchant on les attrapes
    if (err) return console.error(err);

    // pour chaque fichier d'event
    files.forEach(file => {

        // on vérif que c'est bien un .js
        if (!file.endsWith('.js')) return

        // on get son chemin
        const event = require(`./events/${file}`);

        // on récup juste son nom
        let eventName = file.split('.')[0];

        // et on le bind à notre event discord.js en fonction de son nom
        client.on(eventName, event.bind(null, client))
        console.log((`Chargement de l'évènement : `).white + (`${eventName}`).blue);

        fileNumber = fileNumber + 1;
    })

})


// on cherche tous les .js dans le dossier commands
recursive('./commands/', (err, files) => {
    // les erreurs c'est mal
    if (err) return console.error(err);

    console.log(`\n\nCommandes : (` +
        `${files.length}`.bold.yellow + ")");

    // pour chaque commande trouvée
    files.forEach(file => {

        // on vérif que c'est bien un .js
        if (!file.endsWith('.js')) return

        // on récup le chemin
        let props = require(`./${file}`);

        // on récupère le nom du fichier dans le chemin
        let filePath = file.replace(/\\/g, "/")
        let commandName = filePath.split(/\//g).reverse()[0];
        commandName = commandName.split('.')[0];

        // on met dans notre objet le nom de la commande ainsi que son chemin
        client.commands.set(commandName.toLowerCase(), props);

        // on met dans l'objet des alias les différents alias de la commande
        props.config.aliases.forEach(alias => {
            client.aliases.set(alias.toLowerCase(), props.config.name.toLowerCase());
        });

        // on formatte la liste des alias pour que ça soit plus joli à log
        let aliases = props.config.aliases.map(e => e.toString()).join(", ");
        // on log
        console.log(`Chargement de la commande : ` + `${commandName}`.brightRed);
        console.log(`Raccourcis : ` + `${aliases}`.cyan);
        fileNumber = fileNumber + 1;
    })
    console.log(`\nChargement de ` + `${fileNumber}`.yellow + ` fichiers au total.`);
})


// on dit bonjour poliment à discord
client.login(configBOT.token);


client.on("error", (e) => {
    hook.error('**Bot error**', 'quelque chose s\'est mal passé avec le bot', e.message).catch(err => console.log(err.message));
    console.error(e)


});
client.on("warn", (e) => console.warn(e));
//client.on("debug", (e) => console.info(e));


module.exports = { client }